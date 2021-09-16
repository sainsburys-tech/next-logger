const nextLogger = require('next/dist/build/output/log')

const buildJsonLogger = require('../jsonLogger')

Object.entries(nextLogger).forEach(([key, value]) => {
  if (typeof value === 'function') {
    nextLogger[key] = buildJsonLogger(key)
  }
})
