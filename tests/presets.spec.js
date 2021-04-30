const scenarios = require('./scenarios')
const scenarioRunner = require('./runner')

describe('presets', () => {
  describe('all', () => {
    scenarioRunner(scenarios, 'all')
  })

  describe('next-only', () => {
    scenarioRunner(scenarios.next, 'next-only')
  })
})
