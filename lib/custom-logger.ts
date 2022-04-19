import type { defaultPinoConfig } from './defaultPinoConfig'
import type { P } from 'pino'

export type customLogger = (
  _defaultPinoConfig: typeof defaultPinoConfig,
) => P.Logger

export type NextLoggerConfig = {
  logger?: customLogger
}
