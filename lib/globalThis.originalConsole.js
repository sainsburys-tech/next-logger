/// <reference path="originalConsole.global.d.ts" />
/* global globalThis */
/* eslint-disable no-console */

// This is defined up-front, in case any code wants to safely use this.
const originalConsole = {
  debug: console.debug.bind(console),
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
}

if (typeof globalThis !== 'undefined') {
  // @ts-ignore TS2339: Property 'originalConsole' does not exist on type 'typeof globalThis'.
  globalThis.originalConsole = originalConsole
} else {
  // @ts-ignore TS2339: Property 'originalConsole' does not exist on type 'typeof globalThis'.
  global.originalConsole = originalConsole
}
console.log(
  `[next-logger] defined backups: global${
    typeof globalThis !== 'undefined' ? 'This' : ''
  }.originalConsole.{${Object.keys(
    originalConsole,
  ).join(',')}}`,
)

// Tell TS this is a module
module.exports = {}
