/**
 * Other methods are not supported YET
 * These methods simply accept strings and objects
 * Supporting other methods _well_ would be more involved.
 */
export type supportedConsoleMethods = keyof Pick<
  typeof console, // ensure we don't have any typos below, like `warning`
  | 'error'
  | 'warn'
  // | 'dir' // type error with 2nd param `InspectOptions`
  | 'dirxml'
  | 'info'
  | 'log'
  | 'table'
  // | 'debug'
  | 'trace'
>

export type wrappedPinoLogFn =
  (typeof console)[supportedConsoleMethods]

export type createPinoCompatibleConsoleFunction = (
  consoleMethod: supportedConsoleMethods,
  rawPinoLogFn: import('pino').LogFn,
) => wrappedPinoLogFn

/**
 * This type isn't all that great.
 * Return type of `[msg: string, ...args: any[]]` is weird.
 * Pino typically expects an object as first param.
 * The pino.LogFn type could use some work.
 */
export type argShuffler = (
  ...args: any[]
) => Parameters<import('pino').LogFn>
