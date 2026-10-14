// Pattern dei segreti più comuni. Un match blocca la scrittura del file.
const PATTERNS: ReadonlyArray<readonly [string, RegExp]> = [
  ['chiave privata', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['token GitHub', /\b(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ['chiave Anthropic', /\bsk-ant-[A-Za-z0-9_-]{20,}/],
  ['chiave OpenAI', /\bsk-(proj-)?[A-Za-z0-9_-]{32,}/],
  ['token Supabase', /\b(sbp_[a-f0-9]{40}|sb_secret_[A-Za-z0-9_-]{20,})\b/],
  ['JWT (es. chiave Supabase)', /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ['chiave AWS', /\bAKIA[0-9A-Z]{16}\b/],
  ['chiave Stripe live', /\b(sk|rk)_live_[A-Za-z0-9]{20,}/],
  ['token Slack', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['chiave Google API', /\bAIza[0-9A-Za-z_-]{35}\b/],
  [
    'password o token assegnato in chiaro',
    /\b(password|passwd|secret|token|api[_-]?key|access[_-]?key)\b["']?\s*[:=]\s*["'](?![^"']*(\$\{|process\.env|<|your|xxx|example))[^"'\s]{12,}["']/i,
  ],
]

/** Primo tipo di segreto trovato nel testo, o undefined. */
export const findSecret = (text: string): string | undefined =>
  PATTERNS.find(([, re]) => re.test(text))?.[0]

/** I file .env locali sono il posto giusto per i segreti (non vanno su git). */
export const isEnvFile = (path: string): boolean => {
  const name = path.split(/[\\/]/).pop() ?? ''
  return /^\.env(\..+)?$/.test(name) && !/\.(example|sample|template)$/.test(name)
}
