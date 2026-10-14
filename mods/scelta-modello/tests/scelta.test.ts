import { describe, expect, test } from 'claude-code/testing'
import { choose, keepForCache } from '../hooks/rules'

describe('regole', () => {
  test('piano e bug vanno su opus', async () => {
    expect(choose('Fammi un piano per la migrazione').tier).toBe('opus')
    expect(choose('perché non funziona il login?').tier).toBe('opus')
  })
  test('traduzioni e riassunti vanno su haiku', async () => {
    expect(choose('Traduci in inglese questa frase').tier).toBe('haiku')
    expect(choose('riassumi la mail di ieri').tier).toBe('haiku')
  })
  test('un riassunto con codice resta su sonnet', async () => {
    expect(choose('riassumi questo:\n```ts\nconst a = 1\n```').tier).toBe('sonnet')
  })
  test('il resto va su sonnet', async () => {
    expect(choose('aggiungi un pulsante alla pagina contatti').tier).toBe('sonnet')
  })
  test('le conferme tengono il modello di prima', async () => {
    expect(choose('vai', 'opus').tier).toBe('opus')
    expect(choose('2', 'opus').tier).toBe('opus')
    expect(choose('ok', 'haiku').tier).toBe('haiku')
  })
  test('@haiku forza il modello e sparisce dal testo', async () => {
    const c = choose('@haiku fammi un piano veloce')
    expect(c.tier).toBe('haiku')
    expect(c.text).toBe('fammi un piano veloce')
  })
  test('a conversazione lunga non scende di livello', async () => {
    expect(keepForCache('haiku', 'opus', 80)).toBe(true)
    expect(keepForCache('haiku', 'opus', 10)).toBe(false)
    expect(keepForCache('opus', 'haiku', 80)).toBe(false)
  })
})

describe('nel motore', () => {
  test('il prefisso @opus viene tolto dal messaggio', async ($, on) => {
    let seen = ''
    on('prompt.submit', (_$, e) => { seen = e.text; return { text: e.text } as never })
    on('ui.status', () => ({ value: undefined }) as never)
    await $.prompt.submit({ text: '@opus rivedi tutto' } as never)
    expect(seen).toBe('rivedi tutto')
  })
})
