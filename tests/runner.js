/* eslint-disable jest/no-export */
const { exec } = require('child_process')
const { promisify } = require('util')
const os = require('os')

const execAsync = promisify(exec)

const runScript = async (script, preset, cwd) => {
  const entrypoint = preset ? `next-logger/presets/${preset}` : 'next-logger'
  const process = execAsync(`node -r "${entrypoint}" -e "${script}"`, { cwd })
  const { pid } = process
  const { stdout, stderr } = await process
  return { pid, stdout: stdout.trim(), stderr: stderr.trim() }
}

const scenarioRunner = (scenarios, preset) =>
  describe.each(scenarios)('%s', (_, script, expected) => {
    describe.each([
      ['the root folder', undefined],
      ['a nested folder', './tests'],
    ])('when run within %s', (_folder, cwd) => {
      it('prints a JSON style string to stdout', async () => {
        const { stdout } = await runScript(script, preset, cwd)

        expect(stdout).toMatch(/^.*?{.*?}.*?$/ms)
      })

      it('prints a JSON formatted object to stdout', async () => {
        const { stdout } = await runScript(script, preset, cwd)
        const log = JSON.parse(stdout)

        expect(log).toMatchObject(expected)
      })

      it('prints nothing to stderr', async () => {
        const { stderr } = await runScript(script, preset, cwd)

        expect(stderr).toBe('')
      })

      it('logs a timestamp close to Date.now()', async () => {
        const { stdout } = await runScript(script, preset, cwd)
        const log = JSON.parse(stdout)
        const now = Date.now()
        // Acceptable margin of quarter of a second each way
        const acceptableMargin = 250

        expect(typeof log.time).toBe('number')
        expect(log.time).toBeGreaterThanOrEqual(now - acceptableMargin)
        expect(log.time).toBeLessThanOrEqual(now + acceptableMargin)
      })

      it('logs the PID of the process', async () => {
        const { stdout /* , pid: expectedPid */ } = await runScript(script, preset, cwd)
        const { pid } = JSON.parse(stdout)

        expect(typeof pid).toBe('number')
        // expect(pid).toBe(expectedPid)
      })

      it('logs the hostname of the machine', async () => {
        const { stdout } = await runScript(script, preset, cwd)
        const { hostname } = JSON.parse(stdout)

        expect(typeof hostname).toBe('string')
        expect(hostname).toBe(os.hostname())
      })
    })
  })

module.exports = scenarioRunner
module.exports.runScript = runScript
