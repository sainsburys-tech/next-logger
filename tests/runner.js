const { exec } = require('child_process')
const { promisify } = require('util')
const os = require('os')

const execAsync = promisify(exec)

const runScript = async script => {
  const process = execAsync(`node -r "." -e "${script}"`)
  const { pid } = process
  const { stdout, stderr } = await process
  return { pid, stdout: stdout.trim(), stderr: stderr.trim() }
}

const scenarioRunner = scenarios =>
  describe.each(scenarios)('%s', (_, script, expected) => {
    it('prints a JSON style string to stdout', async () => {
      const { stdout } = await runScript(script)

      expect(stdout).toMatch(/^.*?{.*?}.*?$/ms)
    })

    it('prints a JSON formatted object to stdout', async () => {
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

module.exports = scenarioRunner
