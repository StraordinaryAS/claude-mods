import { describe, expect, test } from 'claude-code/testing'

const onBranch = (on: Parameters<Parameters<typeof test>[1]>[1], branch: string) =>
  on('process.run', () => ({ value: { exitCode: 0, stdout: `${branch}\n`, stderr: '' } }) as never)

const answerTools = (on: Parameters<Parameters<typeof test>[1]>[1]) =>
  on('tool.call', () => ({ result: 'ok' }) as never)

describe('git', () => {
  test('commit su main bloccato', async ($, on) => {
    onBranch(on, 'main'); answerTools(on)
    const r = await $.tool.call({ tool: 'Bash', command: 'git add . && git commit -m "x"' } as never)
    expect(r.deny ?? r.text).toContain('bloccato')
  })
  test('commit su un ramo passa', async ($, on) => {
    onBranch(on, 'feature/x'); answerTools(on)
    const r = await $.tool.call({ tool: 'Bash', command: 'git commit -m "x"' } as never)
    expect(r.deny).toBeUndefined()
    expect(r.isError).not.toBe(true)
  })
  test('push esplicito verso main bloccato anche da un ramo', async ($, on) => {
    onBranch(on, 'feature/x'); answerTools(on)
    const r = await $.tool.call({ tool: 'Bash', command: 'git push origin HEAD:main' } as never)
    expect(r.deny ?? r.text).toContain('main')
  })
  test('push di un ramo passa', async ($, on) => {
    onBranch(on, 'main'); answerTools(on)
    const r = await $.tool.call({ tool: 'Bash', command: 'git push -u origin feature/x' } as never)
    expect(r.deny).toBeUndefined()
    expect(r.isError).not.toBe(true)
  })
  test('git status non viene toccato', async ($, on) => {
    onBranch(on, 'main'); answerTools(on)
    const r = await $.tool.call({ tool: 'Bash', command: 'git status' } as never)
    expect(r.isError).not.toBe(true)
  })
})

describe('segreti', () => {
  test('token Supabase in un file bloccato', async ($, on) => {
    answerTools(on)
    const r = await $.tool.call({
      tool: 'Write', file_path: '/x/settings.json',
      content: '{"token": "sbp_' + 'a'.repeat(40) + '"}',
    } as never)
    expect(r.deny ?? r.text).toContain('Supabase')
  })
  test('password assegnata in chiaro bloccata in un Edit', async ($, on) => {
    answerTools(on)
    const r = await $.tool.call({
      tool: 'Edit', file_path: '/x/app.ts', old_string: 'a', new_string: 'const password = "Sup3rS3gretaLunga!"',
    } as never)
    expect(r.deny ?? r.text).toContain('in chiaro')
  })
  test('lo stesso segreto in .env passa', async ($, on) => {
    answerTools(on)
    const r = await $.tool.call({ tool: 'Write', file_path: '/x/.env', content: 'TOKEN=sbp_' + 'a'.repeat(40) } as never)
    expect(r.isError).not.toBe(true)
  })
  test('lettura da variabile d\'ambiente passa', async ($, on) => {
    answerTools(on)
    const r = await $.tool.call({ tool: 'Write', file_path: '/x/app.ts', content: 'const token = process.env.SUPABASE_TOKEN' } as never)
    expect(r.isError).not.toBe(true)
  })
})
