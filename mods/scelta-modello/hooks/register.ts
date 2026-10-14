import type { Register } from 'claude-code'
import { choose, keepForCache, MODEL, type Tier } from './rules'

export const register: Register = on => {
  let enabled = true
  let wanted: Tier | undefined // scelto dall'ultimo messaggio
  let running: Tier | undefined // usato davvero nell'ultimo turno

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'modello-auto',
      description: 'Accende o spegne la scelta automatica del modello (on, off, stato)',
    })
    return next(e)
  })

  on('command.run', { command: 'modello-auto' }, ($, e) => {
    const arg = e.args.trim().toLowerCase()
    if (arg === 'off') enabled = false
    if (arg === 'on') enabled = true
    if (!enabled) $.ui.status(undefined)
    return { text: `Scelta automatica del modello: ${enabled ? 'accesa' : 'spenta'}${running ? ` (ultimo: ${running})` : ''}.` }
  })

  on('prompt.submit', ($, e, next) => {
    if (!enabled || e.command) return next(e)
    const choice = choose(e.text, wanted)
    wanted = choice.tier
    $.ui.status(`modello: ${choice.tier} · ${choice.reason}`)
    return next(choice.text === e.text ? e : { ...e, text: choice.text })
  }).catch(($, e, next) => next(e))

  on('turn.step', async function* ($, e, next) {
    // Solo la conversazione principale; i sotto-agenti restano come sono.
    if (!enabled || !wanted || e.agentId !== undefined) return yield* next(e)

    // Il modello si decide al primo passo del turno e resta fisso fino alla fine.
    if (e.index === 0) {
      running = keepForCache(wanted, running, e.messageCount) ? running! : wanted
      if (running !== wanted) $.ui.status(`modello: ${running} · resto qui, conversazione lunga`)
    }
    const tier = running ?? wanted
    return yield* next({ ...e, model: MODEL[tier] })
  })
}
