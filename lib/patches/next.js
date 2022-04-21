const nextLogger = require('next/dist/build/output/log')
const {
  objectKeys,
  objectHasOwn,
} = require('ts-extras')

const logger = require('../logger')

// TS Goal: cause type error when:
//   1. There's an incorrect method `asdf`
//   2. When there's a missing method (next added a new one)
// Array approach doesn't quite work:
//   Basic attempt: https://www.typescriptlang.org/play?ssl=13&ssc=1&pln=19&pc=2&filetype=js#code/MYewdgzgLgBADgJwKYDMCWAPJEYF4YwD0AVMTAAJQCecSMA3qJFAL4zGEwAU9AUAQHcAhmigAuGAHJhomAFpJAGn4wkCBCAQTJajQnlKVwhGG3GwB5QWRCAJlW037llWjAoQ2tx5cEkANyQwcSkAoNgFKxgoBCFgJG0YuLpIlQA5AFEAdQB9AFkMgBUACQB5ABEctNKcjIAlOtK6xNj4lxYASgBuXl6SYn4ySho6egBBdSEqAB5BghgAayQqEBRokdX4ZHQsCDmAPjYOXiZoGDAkDCgAGRAAczu1PKQoAAsQWxx8LhUAbWkRFAlKF1JpgQCTOCnFRwd4QOCwsFwUl4uChBBbChJABdXgdIA
//   Advanced attempt: https://www.typescriptlang.org/play?ssl=14&ssc=11&pln=14&pc=19&filetype=js#code/MYewdgzgLgBADgJwKYDMCWAPJEYF4YwD0AVMTAAJQCecSMA3qJFAL4zGEwAU9AUAQHcAhmigAuGAHJhomAFpJAGn4wkCBCAQTJajQnlKVwhGG3GwB5QWRCAJlW037llWjAoQ2tx5cEkANyQwcSkAoNgFKxgoBCFgJG0YuLpIlQA5AFEAdQB9AFkMgBUACQB5ABEctNKcjIAlOtK6xNj4lxYASgBuXl6SYn4ySho6eidwABsqGABtQYIYAGskKhAUaJG1+GR0LAgrMgJl1fXqWi3EVExsA4XjrbOkC53r-fmjlYfN9cvdm-elp9Tt9tlc9rcPicNucfi9wQD7sCYaC-hB5gBdNgcXhMaAwMBIDBQAAyIAA5mS1HkkFAABYgWw4fD9CiPBi41jsThcFQzaQiKBKULqTRC-kmMVOKhi7wgMVhYJipLxSTo3gdIA
// Object approach actually works:
//   https://www.typescriptlang.org/play?filetype=js#code/MYewdgzgLgBADgJwKYDMCWAPJEYF4YDeAUDDAO4CGaUAXDAOSXUwC09ANCTEggiAnXo8+CVhy6UEYQZLBjOpZBQAmAT0FK18rmjAoQg3fu2kkANyRhaDc5dhsFMKAgrAkg566QmYAOQCiAOoA+gCy-gAqABIA8gAiwb4xwf4ASqkxqR4ubtoAvgDcRMUA9ABUZTAAAlCqcN4EtfUgKPDI6FgQeTBlJUSgkLBgSBhQADIgAOaTPKFIUAAWIMo4+OWVNXUNA9DdvTAAFMSkTNaMVPbiprz8gsL8PrIyFFI+muoM7z5GBgw-PrYrHcLFYfJ43NkvD4AiFwtF4olkmkMlkGODvGwiHkAJRAA
/**
 * Map next.js internal logger method to pino logger methods.
 *
 * This could be user-configurable in the future.
 *
 * A few pino logger methods are left unused here:
 *  - fatal
 *  - debug
 *  - silent
 *
 * (they are all noop functions at runtime)
 *
 * @type {Record<
 *   keyof typeof nextLogger.prefixes,
 *   keyof Omit<import('pino').BaseLogger, 'level'>
 * >}
 */
const nextLoggerToPinoLoggerMethodMap = {
  error: 'error',
  warn: 'warn',
  trace: 'trace',
  info: 'info',

  // rest:
  wait: 'info',
  ready: 'info',
  event: 'info',
}

const createPrefixedChildLogger = (
  /**
   * @type {{
   *   nextLoggerMethod: keyof typeof nextLogger.prefixes
   *   pinoLoggerMethod: keyof Omit<import('pino').BaseLogger, 'level'>
   * }}
   */
  {
    nextLoggerMethod,
    pinoLoggerMethod,
    // Should we validate against objectKeys(logger.levels.values) ...?
    // Tell you if there are un-used pino methods?
  },
) => {
  // Q: can we 'bind' correct `prefix:` onto each childLogger method?
  // and thus create ONE childLogger instance?
  const childLogger = logger.child({
    name: 'next-logger-nextjs-patch',
    prefix: nextLoggerMethod,
  })

  return childLogger[pinoLoggerMethod].bind(
    childLogger,
  )
}

originalConsole.log(
  '[next-logger] patching next methods:',
  Object.keys(nextLogger.prefixes).join(', '),
)

objectKeys(nextLogger.prefixes).forEach(
  (nextLoggerMethod) => {
    if (
      !objectHasOwn(
        nextLoggerToPinoLoggerMethodMap,
        nextLoggerMethod,
      )
    ) {
      throw new Error(
        [
          `[next-logger] next.js's internal logger has a new un-mapped method: ${nextLoggerMethod}`,
          'Inspect:',
          '  ./node_modules/next/dist/build/output/log',
        ].join('\n'),
      )
    }

    const pinoLoggerMethod =
      nextLoggerToPinoLoggerMethodMap[nextLoggerMethod]

    // Q: can we 'bind' correct `prefix:` onto each childLogger method?
    // and thus create ONE childLogger instance?
    nextLogger[nextLoggerMethod] =
      createPrefixedChildLogger({
        nextLoggerMethod,
        pinoLoggerMethod,
      })
  },
)
