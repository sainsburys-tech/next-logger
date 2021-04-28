const LOGGER_PATH = require('path').join(process.cwd(), 'node_modules', 'next/dist/build/output/log')

// eslint-disable-next-line import/no-dynamic-require
const logger = require(LOGGER_PATH)

const buildJsonLogger = prefix => {
  // eslint-disable-next-line global-require
  const pino = require('pino')({ name: 'next.js' })
  const getLogMethod = method => {
    switch (method) {
      case 'error':
        return pino.error.bind(pino)
      case 'warn':
        return pino.warn.bind(pino)
      default:
        return pino.info.bind(pino)
    }
  }

  return (...args) => {
    const message = args.length === 1 ? args[0] : args
    getLogMethod(prefix)({ prefix }, message)
  }
}

Object.entries(logger).forEach(([key, value]) => {
  if (typeof value === 'function') {
    logger[key] = buildJsonLogger(key)
  }
})
