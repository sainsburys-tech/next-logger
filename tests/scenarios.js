const buildNextJsScript = (method, payload) => `
require('next/dist/build/output/log').${method}(${payload})
`

const buildConsoleScript = (method, payload) => `
console.${method}(${payload})
`

const buildCustomErrorScript = name => `
class ${name} extends Error {
  constructor(...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }

    this.name = '${name}'
  }
}

console.error(new ${name}('Message for ${name}'))
`

const nextScenarios = [
  // Next.js logger - basic messages
  [
    'next.js - wait - message',
    buildNextJsScript('wait', "'Message for wait'"),
    { level: 30, name: 'next.js', msg: 'Message for wait', prefix: 'wait' },
  ],
  [
    'next.js - error - message',
    buildNextJsScript('error', "'Message for error'"),
    { level: 50, name: 'next.js', msg: 'Message for error', prefix: 'error' },
  ],
  [
    'next.js - warn - message',
    buildNextJsScript('warn', "'Message for warn'"),
    { level: 40, name: 'next.js', msg: 'Message for warn', prefix: 'warn' },
  ],
  [
    'next.js - ready - message',
    buildNextJsScript('ready', "'Message for ready'"),
    { level: 30, name: 'next.js', msg: 'Message for ready', prefix: 'ready' },
  ],
  [
    'next.js - info - message',
    buildNextJsScript('info', "'Message for info'"),
    { level: 30, name: 'next.js', msg: 'Message for info', prefix: 'info' },
  ],
  [
    'next.js - event - message',
    buildNextJsScript('event', "'Message for event'"),
    { level: 30, name: 'next.js', msg: 'Message for event', prefix: 'event' },
  ],
  // Next.js logger - objects
  [
    'next.js - wait - object',
    buildNextJsScript('wait', "{ foo: 'Message for wait' }"),
    { level: 30, name: 'next.js', msg: { foo: 'Message for wait' }, prefix: 'wait' },
  ],
  [
    'next.js - error - object',
    buildNextJsScript('error', "{ foo: 'Message for error' }"),
    { level: 50, name: 'next.js', msg: { foo: 'Message for error' }, prefix: 'error' },
  ],
  [
    'next.js - warn - object',
    buildNextJsScript('warn', "{ foo: 'Message for warn' }"),
    { level: 40, name: 'next.js', msg: { foo: 'Message for warn' }, prefix: 'warn' },
  ],
  [
    'next.js - ready - object',
    buildNextJsScript('ready', "{ foo: 'Message for ready' }"),
    { level: 30, name: 'next.js', msg: { foo: 'Message for ready' }, prefix: 'ready' },
  ],
  [
    'next.js - info - object',
    buildNextJsScript('info', "{ foo: 'Message for info' }"),
    { level: 30, name: 'next.js', msg: { foo: 'Message for info' }, prefix: 'info' },
  ],
  [
    'next.js - event - object',
    buildNextJsScript('event', "{ foo: 'Message for event' }"),
    { level: 30, name: 'next.js', msg: { foo: 'Message for event' }, prefix: 'event' },
  ],
]

const consoleScenarios = [
  // Console error - message
  [
    'console.log - message',
    buildConsoleScript('log', "'Message for log'"),
    { level: 30, name: 'next.js', msg: 'Message for log', prefix: 'log' },
  ],
  [
    'console.debug - message',
    buildConsoleScript('debug', "'Message for debug'"),
    { level: 30, name: 'next.js', msg: 'Message for debug', prefix: 'debug' },
  ],
  [
    'console.info - message',
    buildConsoleScript('info', "'Message for info'"),
    { level: 30, name: 'next.js', msg: 'Message for info', prefix: 'info' },
  ],
  [
    'console.warn - message',
    buildConsoleScript('warn', "'Message for warn'"),
    { level: 40, name: 'next.js', msg: 'Message for warn', prefix: 'warn' },
  ],
  [
    'console.error - message',
    buildConsoleScript('error', "'Message for error'"),
    { level: 50, name: 'next.js', msg: 'Message for error', prefix: 'error' },
  ],
  // Console error - object
  [
    'console.log - object',
    buildConsoleScript('log', "{ foo: 'Message for log' }"),
    { level: 30, name: 'next.js', msg: { foo: 'Message for log' }, prefix: 'log' },
  ],
  [
    'console.debug - object',
    buildConsoleScript('debug', "{ foo: 'Message for debug' }"),
    { level: 30, name: 'next.js', msg: { foo: 'Message for debug' }, prefix: 'debug' },
  ],
  [
    'console.info - object',
    buildConsoleScript('info', "{ foo: 'Message for info' }"),
    { level: 30, name: 'next.js', msg: { foo: 'Message for info' }, prefix: 'info' },
  ],
  [
    'console.warn - object',
    buildConsoleScript('warn', "{ foo: 'Message for warn' }"),
    { level: 40, name: 'next.js', msg: { foo: 'Message for warn' }, prefix: 'warn' },
  ],
  [
    'console.error - object',
    buildConsoleScript('error', "{ foo: 'Message for error' }"),
    { level: 50, name: 'next.js', msg: { foo: 'Message for error' }, prefix: 'error' },
  ],
  [
    'console.log - undefined',
    buildConsoleScript('log', undefined),
    { level: 50, name: 'next.js', prefix: 'error' },
  ],
  [
    'console.log - null',
    buildConsoleScript('log', null),
    { level: 50, name: 'next.js', msg: null, prefix: 'error' },
  ],
  // Sanity checks for Pino to make sure `console.*` isn't broken
  [
    'pino - sanity check',
    `require('pino')({ name: 'default-pino' }).info('Message')`,
    { level: 30, name: 'default-pino', msg: 'Message' },
  ],
]

const exceptionScenarios = [
  [
    'exception - error',
    buildConsoleScript('error', "new Error('Message for error')"),
    { level: 50, name: 'next.js', msg: expect.stringMatching(/^Error: Message for error\n/), prefix: 'error' },
  ],
  [
    'exception - custom error',
    buildCustomErrorScript('CustomError'),
    {
      level: 50,
      name: 'CustomError',
      msg: expect.stringMatching(/^CustomError: Message for CustomError\n/),
      prefix: 'error',
    },
  ],
]

module.exports = [...nextScenarios, ...consoleScenarios, ...exceptionScenarios]
module.exports.next = nextScenarios
module.exports.console = consoleScenarios
module.exports.exceptions = exceptionScenarios
