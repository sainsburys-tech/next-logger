const { cosmiconfigSync } = require('cosmiconfig')
const { createLogger } = require('winston')

const defaultWinstonConfig = require('./defaultWinstonConfig')

let config = {}

const explorerSync = cosmiconfigSync('next-logger')
const results = explorerSync.search()

if (results && results.config) {
  config = results.config
}

let loggerConfig

// If logger exists in the config file, and it's a function, use it as the logger constructor.
if ('logger' in config && typeof config.logger === 'function') {
  loggerConfig = config.logger
} else {
  // Otherwise, set the default logger constructor to Winston.
  loggerConfig = defaultWinstonConfig
}

// Call the logger constructor with the library's winston configuration.
module.exports = createLogger(loggerConfig)
