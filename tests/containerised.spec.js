const { GenericContainer } = require('testcontainers')

const scenarios = require('./scenarios')
const scenarioRunner = require('./runner')

describe('containerised tests', () => {
  let container

  const runScriptInDocker = async (script, preset, nextVersion = 12) => {
    const entrypoint = preset ? `next-logger/presets/${preset}` : 'next-logger'
    const { output } = await container.exec(['cd', `next${nextVersion}`, '&&', 'node', '-r', entrypoint, '-e', script])
    return { stdout: output, stderr: '' }
  }

  beforeAll(async () => {
    const builder = await GenericContainer.fromDockerfile(process.cwd(), 'tests/docker/Dockerfile').build()

    container = await builder
      .withCopyFileToContainer('.', 'node_modules/next-logger')
      .withCmd(['cd node_modules/next-logger && npm install --production && top'])
      .start()
  }, 60000)

  afterAll(async () => {
    await container.stop()
  })

  describe('main suite', () => {
    scenarioRunner(scenarios, undefined, runScriptInDocker)
  })

  describe('all', () => {
    scenarioRunner(scenarios, 'all', runScriptInDocker)
  })

  describe('next-only', () => {
    const preset = 'next-only'
    scenarioRunner(scenarios.next, preset, runScriptInDocker)

    it.each([
      ['log', `'Message for log'`, 'Message for log', ''],
      ['log', `{ 'msg': 'log' }`, `{ msg: 'log' }`, ''],
      ['debug', `'Message for debug'`, 'Message for debug', ''],
      ['debug', `{ 'msg': 'debug' }`, `{ msg: 'debug' }`, ''],
      ['info', `'Message for info'`, 'Message for info', ''],
      ['info', `{ 'msg': 'info' }`, `{ msg: 'info' }`, ''],
      ['warn', `'Message for warn'`, '', 'Message for warn'],
      ['warn', `{ 'msg': 'warn' }`, '', `{ msg: 'warn' }`],
      ['error', `'Message for error'`, '', 'Message for error'],
      ['error', `{ 'msg': 'error' }`, '', `{ msg: 'error' }`],
    ])('logs an unpatched output from console."%s"', async (method, payload, stdout, stderr) => {
      const result = await scenarioRunner.runScript(`console.${method}(${payload})`, preset)
      expect(result.stdout).toBe(stdout)
      expect(result.stderr).toBe(stderr)
    })
  })
})
