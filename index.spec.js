const { exec } = require('child_process')
const { promisify } = require('util')
const os = require('os')

const execAsync = promisify(exec)

const runScript = async (script) => {
  const process = execAsync(`node -r "." -e "${script}"`)
  const result = await process
  return { ...process.child, ...result }
}

const buildNextJsScript = (method) => `
require('next/dist/build/output/log').${method}('Message for ${method}')
`

const scenarios = [
  [
    'next.js - wait',
    buildNextJsScript('wait'),
    { level: 30, name: 'next.js', msg: 'Message for wait', prefix: 'wait' },
  ],
  [
    'next.js - error',
    buildNextJsScript('error'),
    { level: 50, name: 'next.js', msg: 'Message for error', prefix: 'error' },
  ],
  [
    'next.js - warn',
    buildNextJsScript('warn'),
    { level: 40, name: 'next.js', msg: 'Message for warn', prefix: 'warn' },
  ],
  [
    'next.js - ready',
    buildNextJsScript('ready'),
    { level: 30, name: 'next.js', msg: 'Message for ready', prefix: 'ready' },
  ],
  [
    'next.js - info',
    buildNextJsScript('info'),
    { level: 30, name: 'next.js', msg: 'Message for info', prefix: 'info' },
  ],
  [
    'next.js - event',
    buildNextJsScript('event'),
    { level: 30, name: 'next.js', msg: 'Message for event', prefix: 'event' },
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
    const { stdout, pid: expectedPid } = await runScript(script)
    const { pid } = JSON.parse(stdout)

    expect(typeof pid).toBe('number')
    expect(pid).toBe(expectedPid)
  })

  it('logs the hostname of the machine', async () => {
    const { stdout } = await runScript(script)
    const { hostname } = JSON.parse(stdout)

    expect(typeof hostname).toBe('string')
    expect(hostname).toBe(os.hostname())
  })
})
