require('../../globalThis.originalConsole')
const {
  runConsolePatch,
} = require('../runConsolePatch')
const {
  createStrictArgShufflerForPino,
} = require('./createStrictArgShufflerForPino')

/** @type {import('../../types').createPinoCompatibleConsoleFunction} */
const createPinoCompatibleConsoleFunction = (
  consoleMethod,
  rawPinoLogFn,
) => {
  /** @type {import('../../types').wrappedPinoLogFn} */
  const wrappedPinoLogFn = (
    /** @type {any[]} */
    ...args
  ) => {
    const pinoArgs =
      createStrictArgShufflerForPino(consoleMethod)(
        args,
      )

    // TODO: a future TS version should be able to understand there's no type error here:
    // It is not solved by 4.7.0 beta
    //   TS2556: A spread argument must either have a tuple type or be passed to a rest parameter.
    // return rawPinoLogFn(...pinoArgs)
    //                     ~~~~~~~~~~~
    // For now, we need the type-checking:
    if (pinoArgs.length === 1) {
      return rawPinoLogFn(...pinoArgs)
    }
    return rawPinoLogFn(...pinoArgs)
  }

  return wrappedPinoLogFn
}

runConsolePatch({
  createPinoCompatibleConsoleFunction,
  loggerName: 'next-logger-strict-console',
})
