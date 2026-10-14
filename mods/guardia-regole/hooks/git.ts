const PROTECTED = new Set(['main', 'master'])

/** I comandi git del testo che fanno commit o push, uno per segmento. */
export const gitActions = (command: string) =>
  command
    .split(/&&|\|\||;|\n|\|/)
    .map(s => s.trim())
    .flatMap(segment => {
      const m = segment.match(/^(?:\S+=\S+\s+)*git\b(.*)$/)
      if (!m) return []
      const tokens = (m[1] ?? '').trim().split(/\s+/).filter(Boolean)
      let dir: string | undefined
      const rest: string[] = []
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === '-C') dir = tokens[++i]
        else rest.push(tokens[i]!)
      }
      const at = rest.findIndex(t => !t.startsWith('-'))
      const verb = rest[at]
      if (verb !== 'commit' && verb !== 'push') return []
      const args = rest.slice(at + 1)
      return [{ verb, dir, args } as const]
    })

/** La cartella dell'ultimo `cd` prima del comando git, se c'è. */
export const cdBefore = (command: string, git: number): string | undefined => {
  const before = command.slice(0, git)
  const all = [...before.matchAll(/(?:^|&&|;)\s*cd\s+("[^"]+"|'[^']+'|\S+)/g)]
  return all.at(-1)?.[1]?.replace(/^["']|["']$/g, '')
}

/** Il push nomina esplicitamente main/master (es. `origin main`, `HEAD:main`). */
export const pushNamesProtected = (args: readonly string[]) =>
  args.some(a => !a.startsWith('-') && PROTECTED.has(a.split(':').pop()!.replace(/^refs\/heads\//, '')))

/** Il push indica un ramo esplicito (remote + refspec). */
export const pushHasRefspec = (args: readonly string[]) =>
  args.filter(a => !a.startsWith('-')).length >= 2

export const isProtected = (branch: string) => PROTECTED.has(branch.trim())
