require('../../globalThis.originalConsole')
const {
  runConsolePatch,
} = require('../runConsolePatch')
const {
  shuffleAndTransformArgsForPino,
} = require('./shuffleAndTransformArgsForPino')

/** @type {import('../../types').createPinoCompatibleConsoleFunction} */
const createPinoCompatibleConsoleFunction = (
  _consoleMethod,
  rawPinoLogFn,
) => {
  // This is a more "type-safe" approach:
  //   The original approach simply assigned the _rawPinoLogFn to console[consoleMethod],
  //   relying on the `logMethod` pino config to re-arrange args to be pino compatible.
  //   However, users may forget to use the provided `hooks.logMethod`, or
  //   simply not understand why it should be used
  /**
   * Take in anything from any console function,
   * shuffle the args to fit pino's happy path,
   * and pass into rawPinoLogFn.
   */
  const wrappedPinoLogFn = (
    /** @type {any[]} */
    ...args
  ) => {
    return rawPinoLogFn(
      ...shuffleAndTransformArgsForPino(args),
    )
  }

  return wrappedPinoLogFn
}

runConsolePatch({
  createPinoCompatibleConsoleFunction,
  loggerName: 'next-logger-patched-console',
})
