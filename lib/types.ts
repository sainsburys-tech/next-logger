/**
 * This type isn't all that great.
 * Return type of `[msg: string, ...args: any[]]` is weird.
 * Pino typically expects an object as first param.
 * The pino.LogFn type could use some work.
 */
export type argShuffler = (
  ...args: any[]
) => Parameters<import('pino').LogFn>
