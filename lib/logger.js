const { cosmiconfigSync } = require('cosmiconfig')
const pino = require('pino')

const defaultPinoConfig = require('./defaultPinoConfig')

let config = {}

const explorerSync = cosmiconfigSync('next-logger')
const results = explorerSync.search()

if (results && results.config) {
  config = results.config
}

// Set the default logger constructor to Pino.
let logger = pino

// If logger exists in the config file, and it's a function, use it as the logger constructor.
if ('logger' in config && typeof config.logger === 'function') {
  logger = config.logger
}

// Call the logger constructor with the library's default Pino configuration.
module.exports = logger(defaultPinoConfig)
