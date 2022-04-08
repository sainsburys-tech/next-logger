const pino = require('pino')

const logger = (defaultConfig) =>
  pino({
    ...defaultConfig,
    messageKey: 'message',
    mixin: () => ({ name: 'custom-pino-instance' }),
  })

module.exports = {
  logger,
}
