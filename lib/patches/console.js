const logger = require('../logger')

const getLogMethod = consoleMethod => {
  const childLogger = logger.child({ name: 'console' })

  switch (consoleMethod) {
    case 'error':
      return childLogger.error.bind(childLogger)
    case 'warn':
      return childLogger.warn.bind(childLogger)
    case 'debug':
      return childLogger.debug.bind(childLogger)
    case 'trace':
      return childLogger.trace.bind(childLogger)
    case 'log':
    case 'info':
    default:
      return childLogger.info.bind(childLogger)
  }
}

const consoleMethods = ['log', 'trace', 'debug', 'info', 'warn', 'error']
consoleMethods.forEach(method => {
  // eslint-disable-next-line no-console
  console[method] = getLogMethod(method)
})
