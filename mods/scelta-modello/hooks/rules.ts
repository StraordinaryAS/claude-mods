// Regole fisse: nessun modello viene chiamato per decidere.
// Per cambiarle, modifica le liste qui sotto.

export type Tier = 'haiku' | 'sonnet' | 'opus'

/**
 * Id completo passato al motore per ogni livello.
 * Gli alias ('sonnet') non funzionano ovunque: in VS Code danno "model may not exist".
 */
export const MODEL: Record<Tier, string> = {
  haiku: 'claude-haiku-5-5',
  sonnet: 'claude-sonnet-5-5',
  opus: 'claude-opus-5-5',
}

const RANK: Record<Tier, number> = { haiku: 0, sonnet: 1, opus: 2 }

// Lavoro che richiede ragionamento: piani, architettura, bug, revisioni.
const OPUS = /\b(piano|pianifica|architettura|progett[ai]|strategi[ae]|analizza a fondo|ragiona|perch[eé] non funziona|debug|bug|non capisco perch[eé]|refactor\w*|rivedi il codice|code review|sicurezza|vulnerabilit)/i

// Compiti meccanici e brevi: traduzioni, riassunti, formattazione.
const HAIKU = /\b(tradu[ci]\w*|riassum\w*|riassunto|correggi (l'ortografia|i refusi|gli errori di battitura)|rinomina|formatta|elenca|converti in|estrai (i |le )?(dati|date|nomi|email)|che ore)/i

// Conferme brevi: proseguono il lavoro in corso, quindi tengono il modello di prima.
const CONFIRM = /^(vai|ok|okay|s[iì]|no|fatto|procedi|continua|perfetto|grazie|va bene|\d{1,2}[.)]?|[a-c])\W*$/i

const OVERRIDE = /^\s*@(haiku|sonnet|opus)\b\s*/i

export type Choice = { tier: Tier; reason: string; text: string }

/**
 * Sceglie il livello per un nuovo messaggio.
 * `previous` è il livello del turno prima, se c'è.
 */
export const choose = (raw: string, previous?: Tier): Choice => {
  const forced = raw.match(OVERRIDE)
  if (forced) return { tier: forced[1]!.toLowerCase() as Tier, reason: 'scelto da te', text: raw.replace(OVERRIDE, '') }

  const text = raw.trim()
  if (previous && (text === '' || CONFIRM.test(text))) return { tier: previous, reason: 'conferma, prosegue', text: raw }
  if (OPUS.test(text)) return { tier: 'opus', reason: 'ragionamento', text: raw }
  if (HAIKU.test(text) && text.length < 600 && !text.includes('```')) return { tier: 'haiku', reason: 'compito semplice', text: raw }
  return { tier: 'sonnet', reason: 'predefinito', text: raw }
}

/**
 * A conversazione lunga, scendere di livello costa più di quanto fa risparmiare:
 * il nuovo modello deve rileggere tutto il contesto senza cache.
 */
export const LONG_CONVERSATION = 40

export const keepForCache = (wanted: Tier, current: Tier | undefined, messageCount: number) =>
  current !== undefined && RANK[wanted] < RANK[current] && messageCount > LONG_CONVERSATION
