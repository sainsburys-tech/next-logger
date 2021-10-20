const { GenericContainer } = require('testcontainers')
const path = require('path')

const { buildNextJsScript } = require('./scenarios')

describe('config', () => {
  let builder

  const runScriptInDockerWithConfig = async (script, preset, configFilePath) => {
    const entrypoint = preset ? `next-logger/presets/${preset}` : 'next-logger'

    const container = await builder
      .withBindMount(configFilePath, '/app/next-logger.config.js', 'ro')
      .withCmd(['top'])
      .start()
    const { output, exitCode } = await container.exec(['node', '-r', entrypoint, '-e', script])

    await container.stop()

    return { stdout: output, exitCode }
  }

  beforeAll(async () => {
    builder = await GenericContainer.fromDockerfile(process.cwd(), 'tests/docker/Dockerfile').build()
  }, 60000)

  it('loads a config from the working directory and uses that Pino instance', async () => {
    const script = buildNextJsScript('info', "'Message for info'")
    const configFilePath = path.resolve(__dirname, 'config/next-logger.config.js')
    const { stdout, exitCode } = await runScriptInDockerWithConfig(script, undefined, configFilePath)

    expect(exitCode).toBe(0)
    expect(JSON.parse(stdout)).toMatchObject({
      message: 'Message for info',
    })
  })
})
