const buildJsonLogger = require('../jsonLogger')

const consoleMethods = ['log', 'debug', 'info', 'warn', 'error']
consoleMethods.forEach(method => {
  // eslint-disable-next-line no-console
  console[method] = buildJsonLogger(method)
})
