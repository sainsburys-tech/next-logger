const { exec } = require('child_process')
const { promisify } = require('util')
const os = require('os')

const execAsync = promisify(exec)

const runScript = async script => {
  const process = execAsync(`node -r "." -e "${script}"`)
  const result = await process
  return { ...process.child, ...result }
}

const buildNextJsScript = (method, payload) => `
require('next/dist/build/output/log').${method}(${payload})
`

const scenarios = [
  // Next.js logger - basic messages
  [
    'next.js - wait - message',
    buildNextJsScript('wait', "'Message for wait'"),
    { level: 30, name: 'next.js', msg: 'Message for wait', prefix: 'wait' },
  ],
  [
    'next.js - error - message',
    buildNextJsScript('error', "'Message for error'"),
    { level: 50, name: 'next.js', msg: 'Message for error', prefix: 'error' },
  ],
  [
    'next.js - warn - message',
    buildNextJsScript('warn', "'Message for warn'"),
    { level: 40, name: 'next.js', msg: 'Message for warn', prefix: 'warn' },
  ],
  [
    'next.js - ready - message',
    buildNextJsScript('ready', "'Message for ready'"),
    { level: 30, name: 'next.js', msg: 'Message for ready', prefix: 'ready' },
  ],
  [
    'next.js - info - message',
    buildNextJsScript('info', "'Message for info'"),
    { level: 30, name: 'next.js', msg: 'Message for info', prefix: 'info' },
  ],
  [
    'next.js - event - message',
    buildNextJsScript('event', "'Message for event'"),
    { level: 30, name: 'next.js', msg: 'Message for event', prefix: 'event' },
  ],
  // Next.js logger - objects
  [
    'next.js - wait - object',
    buildNextJsScript('wait', "{ foo: 'Message for wait' }"),
    { level: 30, name: 'next.js', msg: { foo: 'Message for wait' }, prefix: 'wait' },
  ],
  [
    'next.js - error - object',
    buildNextJsScript('error', "{ foo: 'Message for error' }"),
    { level: 50, name: 'next.js', msg: { foo: 'Message for error' }, prefix: 'error' },
  ],
  [
    'next.js - warn - object',
    buildNextJsScript('warn', "{ foo: 'Message for warn' }"),
    { level: 40, name: 'next.js', msg: { foo: 'Message for warn' }, prefix: 'warn' },
  ],
  [
    'next.js - ready - object',
    buildNextJsScript('ready', "{ foo: 'Message for ready' }"),
    { level: 30, name: 'next.js', msg: { foo: 'Message for ready' }, prefix: 'ready' },
  ],
  [
    'next.js - info - object',
    buildNextJsScript('info', "{ foo: 'Message for info' }"),
    { level: 30, name: 'next.js', msg: { foo: 'Message for info' }, prefix: 'info' },
  ],
  [
    'next.js - event - object',
    buildNextJsScript('event', "{ foo: 'Message for event' }"),
    { level: 30, name: 'next.js', msg: { foo: 'Message for event' }, prefix: 'event' },
  ],
]

describe.each(scenarios)('%s', (_, script, expected) => {
  it('prints a JSON formatted log to stdout', async () => {
    const { stdout } = await runScript(script)
    const log = JSON.parse(stdout)

    expect(log).toMatchObject(expected)
  })

  it('prints nothing to stderr', async () => {
    const { stderr } = await runScript(script)

    expect(stderr).toBe('')
  })

  it('logs a timestamp close to Date.now()', async () => {
    const { stdout } = await runScript(script)
    const log = JSON.parse(stdout)
    const now = Date.now()
    // Acceptable margin of quarter of a second each way
    const acceptableMargin = 250

    expect(typeof log.time).toBe('number')
    expect(log.time).toBeGreaterThanOrEqual(now - acceptableMargin)
    expect(log.time).toBeLessThanOrEqual(now + acceptableMargin)
  })

  it('logs the PID of the process', async () => {
    const { stdout /* , pid: expectedPid */ } = await runScript(script)
    const { pid } = JSON.parse(stdout)

    expect(typeof pid).toBe('number')
    // expect(pid).toBe(expectedPid)
  })

  it('logs the hostname of the machine', async () => {
    const { stdout } = await runScript(script)
    const { hostname } = JSON.parse(stdout)

    expect(typeof hostname).toBe('string')
    expect(hostname).toBe(os.hostname())
  })
})
