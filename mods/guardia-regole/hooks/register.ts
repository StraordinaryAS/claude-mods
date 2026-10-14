import type { Register } from 'claude-code'
import { findSecret, isEnvFile } from './secrets'
import { cdBefore, gitActions, isProtected, pushHasRefspec, pushNamesProtected } from './git'

const NO_MAIN =
  'Regola di Ale: mai lavorare su main. Crea un ramo (git switch -c <nome>) e fai lì commit e push; il merge su main solo dopo il suo via.'

export const register: Register = on => {
  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const command = e.command
    for (const { verb, dir, args } of gitActions(command)) {
      if (verb === 'push' && pushNamesProtected(args))
        return { deny: `${$.plugin.name}: push verso main/master bloccato. ${NO_MAIN}` }
      if (verb === 'push' && pushHasRefspec(args)) continue

      const cwd = dir ?? cdBefore(command, command.indexOf('git'))
      const head = await $.process.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], cwd ? { cwd } : undefined)
      if (head.exitCode === 0 && isProtected(head.stdout))
        return { deny: `${$.plugin.name}: ${verb} sul ramo ${head.stdout.trim()} bloccato. ${NO_MAIN}` }
    }
    return next(e)
  }).catch(($, e, next) => next(e)) // se la guardia si rompe, non blocca il lavoro

  on('tool.call', { tool: ['Write', 'Edit', 'NotebookEdit'] }, ($, e, next) => {
    const path = 'file_path' in e ? e.file_path : 'notebook_path' in e ? e.notebook_path : ''
    if (isEnvFile(String(path))) return next(e)
    const text = 'content' in e ? e.content : 'new_string' in e ? e.new_string : 'new_source' in e ? e.new_source : ''
    const kind = findSecret(String(text ?? ''))
    return kind
      ? {
          deny:
            `${$.plugin.name}: ${kind} in chiaro in ${path}. Regola di Ale: segreti mai in chiaro nei file. ` +
            'Mettilo in .env (non versionato) o in una variabile d\'ambiente e leggilo da lì.',
        }
      : next(e)
  }).catch(($, e, next) => next(e))
}
