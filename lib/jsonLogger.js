const logger = require('pino')({ name: 'next.js' })

const getLogMethod = level => {
  switch (level) {
    case 'error':
      return logger.error.bind(logger, { prefix: level })
    case 'warn':
      return logger.warn.bind(logger, { prefix: level })
    default:
      return logger.info.bind(logger, { prefix: level })
  }
}

module.exports = prefix => {
  const logMethod = getLogMethod(prefix)

  return (...args) => {
    const message = args.length === 1 ? args[0] : args
    logMethod(message)
  }
}
