type originalConsole = {
  debug: typeof console.debug
  log: typeof console.log
  warn: typeof console.warn
  error: typeof console.error
}

declare const originalConsole: originalConsole
