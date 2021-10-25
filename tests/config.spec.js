const { GenericContainer } = require('testcontainers')
const path = require('path')

const { buildNextJsScript } = require('./scenarios')

describe('config', () => {
  let container

  const runScriptInDockerWithConfig = async (script, preset) => {
    const entrypoint = preset ? `next-logger/presets/${preset}` : 'next-logger'
    const { output, exitCode } = await container.exec(['node', '-r', entrypoint, '-e', script])
    return { stdout: output, exitCode }
  }

  beforeAll(async () => {
    const builder = await GenericContainer.fromDockerfile(process.cwd(), 'tests/docker/Dockerfile').build()
    const configFilePath = path.resolve(__dirname, 'config/next-logger.config.js')
    container = await builder.withBindMount(configFilePath, '/app/next-logger.config.js', 'ro').withCmd(['top']).start()
  }, 60000)

  afterAll(async () => {
    await container.stop()
  })

  it('loads a config from the working directory and uses that Pino instance', async () => {
    const script = buildNextJsScript('info', "'Message for info'")
    const { stdout, exitCode } = await runScriptInDockerWithConfig(script, undefined)

    expect(exitCode).toBe(0)
    expect(JSON.parse(stdout)).toMatchObject({
      message: 'Message for info',
    })
  })

  it("includes the default behaviour from the library's Pino config", async () => {
    const script = buildNextJsScript('info', "'Hello World', new Error('Boom')")
    const { stdout, exitCode } = await runScriptInDockerWithConfig(script, undefined)

    expect(exitCode).toBe(0)
    expect(JSON.parse(stdout)).toMatchObject({
      err: { message: 'Boom', type: 'Error', stack: expect.stringMatching(/Error: Boom\n *?at \[eval\]/) },
      message: 'Hello World',
    })
  })
})
