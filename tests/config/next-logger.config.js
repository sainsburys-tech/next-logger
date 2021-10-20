const pino = require('pino')

const logger = pino({ messageKey: 'message', mixin: () => ({ name: 'custom-pino-instance' }) })

module.exports = {
  logger,
}
