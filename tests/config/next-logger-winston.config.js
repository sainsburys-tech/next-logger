const { createLogger, format, transports } = require('winston')

const logger = defaultConfig =>
  createLogger({
    ...defaultConfig,
    defaultMeta: { name: 'custom-winston-instance' },
    transports: [
      new transports.Console({
        handleExceptions: true,
        format: format.json(),
      }),
    ],
  })

module.exports = {
  logger,
}
