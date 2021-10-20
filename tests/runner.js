/* eslint-disable jest/no-export */
const { exec } = require('child_process')
const { promisify } = require('util')

const execAsync = promisify(exec)

const defaultScriptRunner = async (script, preset) => {
  const entrypoint = preset ? `./presets/${preset}` : '.'
  const process = execAsync(`node -r "${entrypoint}" -e "${script}"`)
  const { pid } = process
  const { stdout, stderr } = await process
  return { pid, stdout: stdout.trim(), stderr: stderr.trim() }
}

const scenarioRunner = (scenarios, preset, scriptRunner = defaultScriptRunner) =>
  describe.each(scenarios)('%s', (_, script, expected) => {
    it('prints a JSON style string to stdout', async () => {
      const { stdout } = await scriptRunner(script, preset)

      expect(stdout).toMatch(/^.*?{.*?}.*?$/ms)
    })

    it('prints a JSON formatted object to stdout', async () => {
      const { stdout } = await scriptRunner(script, preset)
      const log = JSON.parse(stdout)

      expect(log).toMatchObject(expected)
    })

    it('prints nothing to stderr', async () => {
      const { stderr } = await scriptRunner(script, preset)

      expect(stderr).toBe('')
    })

    it('logs a timestamp close to Date.now()', async () => {
      const { stdout } = await scriptRunner(script, preset)
      const log = JSON.parse(stdout)
      const now = Date.now()
      // Acceptable margin of quarter of a second each way
      const acceptableMargin = 250

      expect(typeof log.time).toBe('number')
      expect(log.time).toBeGreaterThanOrEqual(now - acceptableMargin)
      expect(log.time).toBeLessThanOrEqual(now + acceptableMargin)
    })

    it('logs the PID of the process', async () => {
      const { stdout /* , pid: expectedPid */ } = await scriptRunner(script, preset)
      const { pid } = JSON.parse(stdout)

      expect(typeof pid).toBe('number')
      // expect(pid).toBe(expectedPid)
    })

    it('logs the hostname of the machine', async () => {
      const { stdout } = await scriptRunner(script, preset)
      const { hostname } = JSON.parse(stdout)

      expect(typeof hostname).toBe('string')
      // expect(hostname).toBe(os.hostname())
    })
  })

module.exports = scenarioRunner
module.exports.runScript = defaultScriptRunner
