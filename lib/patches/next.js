const LOGGER_PATH = require('path').join(process.cwd(), 'node_modules', 'next/dist/build/output/log')

// eslint-disable-next-line import/no-dynamic-require
const nextLogger = require(LOGGER_PATH)
const buildJsonLogger = require('../jsonLogger')

Object.entries(nextLogger).forEach(([key, value]) => {
  if (typeof value === 'function') {
    nextLogger[key] = buildJsonLogger(key)
  }
})
