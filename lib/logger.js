const { cosmiconfigSync } = require('cosmiconfig')

const defaultLogger = require('./defaultLogger')

let config = {}
let logger = defaultLogger

const explorerSync = cosmiconfigSync('next-logger')
const results = explorerSync.search()

if (results && results.config) {
  config = results.config
}

if ('logger' in config && config.logger && typeof config.logger.child === 'function') {
  logger = config.logger
}

module.exports = logger
