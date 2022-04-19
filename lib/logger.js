const { cosmiconfigSync } = require('cosmiconfig')

const {
  defaultPinoConfig,
} = require('./defaultPinoConfig')

/** @type {import('./custom-logger').NextLoggerConfig} */
let config = {}

const explorerSync = cosmiconfigSync('next-logger')
const results = explorerSync.search()

if (results && results.config) {
  config = results.config
}

/** @type {import('./custom-logger').customLogger} */
let logger

// If logger exists in the config file, and it's a function, use it as the logger constructor.
if (
  'logger' in config &&
  typeof config.logger === 'function'
) {
  logger = config.logger
} else {
  // Otherwise, set the default logger constructor to Pino.
  // We call require here, as we may not need to load pino at all if user has defined their own logger.
  // eslint-disable-next-line global-require
  logger = require('pino').pino
}

// Call the logger constructor with the library's default Pino configuration.
// NOTE: importing this file multiple times does not end up calling `logger` multiple times: https://stackoverflow.com/a/52359829/565877
module.exports = logger(defaultPinoConfig)
