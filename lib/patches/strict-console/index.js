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
    return rawPinoLogFn(
      createStrictArgShufflerForPino(consoleMethod)(
        args,
      ),
    )
  }

  return wrappedPinoLogFn
}

runConsolePatch({
  createPinoCompatibleConsoleFunction,
  loggerName: 'next-logger-strict-console',
})
