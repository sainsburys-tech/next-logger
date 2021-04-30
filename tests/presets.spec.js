const scenarios = require('./scenarios')
const scenarioRunner = require('./runner')

describe('presets', () => {
  describe('all', () => {
    scenarioRunner(scenarios, 'all')
  })

  describe('next-only', () => {
    const preset = 'next-only'
    scenarioRunner(scenarios.next, preset)

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
