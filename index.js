const LOGGER_PATH = require('path').join(process.cwd(), 'node_modules', 'next/dist/build/output/log')

// eslint-disable-next-line import/no-dynamic-require
const nextLogger = require(LOGGER_PATH)
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

const buildJsonLogger = prefix => {
  const logMethod = getLogMethod(prefix)

  return (...args) => {
    const message = args.length === 1 ? args[0] : args
    logMethod(message)
  }
}

Object.entries(nextLogger).forEach(([key, value]) => {
  if (typeof value === 'function') {
    nextLogger[key] = buildJsonLogger(key)
  }
})

const consoleMethods = ['log', 'debug', 'info', 'warn', 'error']
consoleMethods.forEach(method => {
  // eslint-disable-next-line no-console
  console[method] = buildJsonLogger(method)
})
