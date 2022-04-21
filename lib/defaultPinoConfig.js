const {
  shuffleAndTransformArgsForPino,
} = require('./patches/console/shuffleAndTransformArgsForPino')

/**
 * If you are using pino and the console patch, logging
 * may not work without the `hooks.logMethod` provided here.
 */
const defaultPinoConfig = /** @type {const} */ ({
  level: 'debug',
  hooks: {
    // https://getpino.io/#/docs/api?id=logmethod
    /**
     * May throw errors in certain edge cases
     *
     * @type {Required<
     *   Required<
     *     import('pino').P.LoggerOptions
     *   >['hooks']
     * >['logMethod']}
     */
    // eslint-disable-next-line no-unused-vars
    logMethod(args, method, _level) {
      return method.apply(
        this,
        shuffleAndTransformArgsForPino(args),
      )
    },
  },
})

module.exports = {
  defaultPinoConfig,
}
