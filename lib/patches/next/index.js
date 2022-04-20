require('../../globalThis.originalConsole')
const nextLogger = require('next/dist/build/output/log')

const logger = require('../../logger')

const getPinoMethod = (nextMethod) => {
  const childLogger = logger.child({
    name: 'next.js',
    prefix: nextMethod,
  })

  switch (nextMethod) {
    case 'error':
      return childLogger.error.bind(childLogger)
    case 'warn':
      return childLogger.warn.bind(childLogger)
    case 'trace':
      return childLogger.trace.bind(childLogger)
    default:
      return childLogger.info.bind(childLogger)
  }
}

Object.keys(nextLogger.prefixes).forEach((method) => {
  nextLogger[method] = getPinoMethod(method)
})
