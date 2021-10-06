const resolve = require('resolve')

const LOGGER_PATH = resolve.sync('next/dist/build/output/log', { basedir: __dirname })

// eslint-disable-next-line import/no-dynamic-require
const nextLogger = require(LOGGER_PATH)

const buildJsonLogger = require('../jsonLogger')

Object.entries(nextLogger).forEach(([key, value]) => {
  if (typeof value === 'function') {
    nextLogger[key] = buildJsonLogger(key)
  }
})
