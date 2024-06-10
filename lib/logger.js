const { lilconfigSync } = require('lilconfig')

const defaultPinoConfig = require('./defaultPinoConfig')

let config = {}

const explorerSync = lilconfigSync('next-logger')
const results = explorerSync.search()

if (results && results.config) {
  config = results.config
}

let logger

// If logger exists in the config file, and it's a function, use it as the logger constructor.
if ('logger' in config && typeof config.logger === 'function') {
  logger = config.logger
} else {
  // Otherwise, set the default logger constructor to Pino.
  // eslint-disable-next-line global-require
  logger = require('pino')
}

// Call the logger constructor with the library's default Pino configuration.
module.exports = logger(defaultPinoConfig)
