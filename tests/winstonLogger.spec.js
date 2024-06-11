const { GenericContainer } = require('testcontainers')
const path = require('path')

const { buildNextJsScript } = require('./scenarios')

const winstonScenarios = [
  // Next.js logger - basic messages
  [
    'next.js - wait - message',
    buildNextJsScript('wait', "'Message for wait'"),
    { level: 'info', name: 'custom-winston-instance', message: 'Message for wait', prefix: 'wait' },
  ],
  [
    'next.js - error - message',
    buildNextJsScript('error', "'Message for error'"),
    { level: 'error', name: 'custom-winston-instance', message: 'Message for error', prefix: 'error' },
  ],
  [
    'next.js - warn - message',
    buildNextJsScript('warn', "'Message for warn'"),
    { level: 'warn', name: 'custom-winston-instance', message: 'Message for warn', prefix: 'warn' },
  ],
  [
    'next.js - ready - message',
    buildNextJsScript('ready', "'Message for ready'"),
    { level: 'info', name: 'custom-winston-instance', message: 'Message for ready', prefix: 'ready' },
  ],
  [
    'next.js - info - message',
    buildNextJsScript('info', "'Message for info'"),
    { level: 'info', name: 'custom-winston-instance', message: 'Message for info', prefix: 'info' },
  ],
  [
    'next.js - event - message',
    buildNextJsScript('event', "'Message for event'"),
    { level: 'info', name: 'custom-winston-instance', message: 'Message for event', prefix: 'event' },
  ],
  [
    'next.js - trace - message',
    buildNextJsScript('trace', "'Message for event'"),
    { level: 'debug', name: 'custom-winston-instance', message: 'Message for event', prefix: 'trace' },
  ],
  // Next.js logger - objects
  [
    'next.js - wait - object',
    buildNextJsScript('wait', "{ foo: 'Message for wait' }"),
    { level: 'info', name: 'custom-winston-instance', message: { foo: 'Message for wait' }, prefix: 'wait' },
  ],
  [
    'next.js - error - object',
    buildNextJsScript('error', "{ foo: 'Message for error' }"),
    { level: 'error', name: 'custom-winston-instance', message: { foo: 'Message for error' }, prefix: 'error' },
  ],
  [
    'next.js - warn - object',
    buildNextJsScript('warn', "{ foo: 'Message for warn' }"),
    { level: 'warn', name: 'custom-winston-instance', message: { foo: 'Message for warn' }, prefix: 'warn' },
  ],
  [
    'next.js - ready - object',
    buildNextJsScript('ready', "{ foo: 'Message for ready' }"),
    { level: 'info', name: 'custom-winston-instance', message: { foo: 'Message for ready' }, prefix: 'ready' },
  ],
  [
    'next.js - info - object',
    buildNextJsScript('info', "{ foo: 'Message for info' }"),
    { level: 'info', name: 'custom-winston-instance', message: { foo: 'Message for info' }, prefix: 'info' },
  ],
  [
    'next.js - event - object',
    buildNextJsScript('event', "{ foo: 'Message for event' }"),
    { level: 'info', name: 'custom-winston-instance', message: { foo: 'Message for event' }, prefix: 'event' },
  ],
  [
    'next.js - trace - object',
    buildNextJsScript('trace', "{ foo: 'Message for trace' }"),
    { level: 'debug', name: 'custom-winston-instance', message: { foo: 'Message for trace' }, prefix: 'trace' },
  ],
  // Next.js logger - multiple arguments
  [
    'next.js - info - multiple arguments',
    // https://github.com/vercel/next.js/blob/6852efff4578a3029a3fbdd01d73b725d3e48b9e/examples/with-aws-amplify/pages/index.js#L62
    buildNextJsScript('warn', "'Error adding to do ', new Error('Boom')"),
    {
      level: 'warn',
      name: 'custom-winston-instance',
      message: 'Error adding to do  Boom',
      prefix: 'warn',
      // "stack": .+
    },
  ],
]

describe('winston', () => {
  let container

  const runScriptInDockerWithConfig = async (script, preset) => {
    const entrypoint = preset ? `next-logger/presets/${preset}` : 'next-logger'
    const { output, exitCode } = await container.exec(['node', '-r', entrypoint, '-e', script])
    return { stdout: output, exitCode }
  }

  beforeAll(async () => {
    const builder = await GenericContainer.fromDockerfile(process.cwd(), 'tests/docker/Dockerfile').build()
    const configFilePath = path.resolve(__dirname, 'config/next-logger-winston.config.js')
    container = await builder
      .withBindMounts([{ source: configFilePath, target: '/app/next-logger.config.js', mode: 'ro' }])
      .withCommand(['top'])
      .start()
  }, 60000)

  afterAll(async () => {
    await container.stop()
  })

  it.each(winstonScenarios)('%s', async (_, script, expected) => {
    const { stdout } = await runScriptInDockerWithConfig(script, undefined)
    const log = JSON.parse(stdout)
    expect(log).toMatchObject(expected)
  })
})
