const { ObjectTyped } = require('object-typed')
const logger = require('../logger')

/**
 * Map console method to pino logger methods.
 *
 * This could be user-configurable in the future.
 *
 * There ARE A few pino logger methods are left unused here (they are all noop functions at runtime):
 *  - fatal
 *  - debug
 *  - silent
 *
 * Why use an object? See next-logger/lib/patches/next.js
 *
 * @type {Record<
 *   import('../types').supportedConsoleMethods,
 *   keyof Omit<
 *     import('pino').BaseLogger, 'level'
 *   > | undefined
 * >}
 */
const consoleToPinoLoggerMethodMap = {
  error: 'error' /* direct map */,
  warn: 'warn' /* direct map */,
  log: 'info' /* direct map */,
  info: 'info' /* direct map */,
  dirxml: 'debug',
  table: 'info',
  // debug: 'debug' /* intentionally untracked */,
  trace: 'trace' /* direct map */,
}

const createPrefixedChildLogger = (
  /**
   * @type {{
   *   name: string
   *   prefix: string
   *   pinoLoggerMethod: keyof Omit<
   *     import('pino').BaseLogger,
   *     'level'
   *   >
   * }}
   */
  {
    name,
    prefix,
    pinoLoggerMethod,
    // validate against objectKeys(logger.levels.values) ...?
  },
) => {
  const childLogger = logger.child({
    name,
    prefix,
  })

  return childLogger[pinoLoggerMethod].bind(
    childLogger,
  )
}

const runConsolePatch = (
  /**
   * @type {{
   *   createPinoCompatibleConsoleFunction: (
   *     import('../types')
   *       .createPinoCompatibleConsoleFunction
   *   )
   *   loggerName: string
   * }}
   */
  { createPinoCompatibleConsoleFunction, loggerName },
) => {
  // @ts-expect-error - Truthy :)
  // eslint-disable-next-line no-console
  if (console.hasBeenPatchedByNextLogger) {
    // This should never happen if next-logger is configured correctly.
    throw new Error(
      '[next-logger] console has already been patched!',
    )
  }
  // @ts-expect-error - Truthy - but will not cause error if some code calls it.
  // eslint-disable-next-line no-console
  console.hasBeenPatchedByNextLogger = () => {}
  // eslint-disable-next-line no-undef
  originalConsole.log(
    '[next-logger] patching console methods:',
    ObjectTyped.keys(
      consoleToPinoLoggerMethodMap,
    ).join(', '),
  )

  ObjectTyped.keys(
    consoleToPinoLoggerMethodMap,
  ).forEach((consoleMethod) => {
    const pinoLoggerMethod =
      consoleToPinoLoggerMethodMap[consoleMethod]
    if (pinoLoggerMethod === undefined) return

    // eslint-disable-next-line no-console
    console[consoleMethod] =
      createPinoCompatibleConsoleFunction(
        consoleMethod,
        createPrefixedChildLogger({
          name: loggerName,
          prefix: consoleMethod,
          pinoLoggerMethod,
        }),
      )
  })
}

module.exports = { runConsolePatch }
