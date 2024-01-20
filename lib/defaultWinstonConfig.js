const { format, transports } = require('winston')

// Example usage: https://github.com/winstonjs/winston#usage
module.exports = {
  level: 'debug',
  defaultMeta: { type: 'nextjs' },
  transports: [new transports.Console({ handleExceptions: true })],
  format: format.combine(format.timestamp(), format.simple(), format.colorize()),
}
