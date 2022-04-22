// This is coming out as `any` when using skipLibCheck: true in consuming project
// Converting to `import { ` (i.e. value import) does not fix the issue.
// Likely doing full TS conversion will be the best solution.
// import type { defaultPinoConfig } from './defaultPinoConfig'
import type { pino } from 'pino'

type _defaultPinoConfigHack = {
  readonly level: 'debug'
  readonly hooks: {
    readonly logMethod: (
      args: any[],
      method: pino.LogFn,
      level: number,
    ) => void
  }
}

export type customLogger = (
  _defaultPinoConfig: _defaultPinoConfigHack,
) => pino.Logger

export type NextLoggerConfig = {
  logger?: customLogger
}
