const scenarios = require('./scenarios')
const scenarioRunner = require('./runner')

describe('main suite', () => {
  scenarioRunner(scenarios)
})
