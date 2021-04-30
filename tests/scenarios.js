const buildNextJsScript = (method, payload) => `
require('next/dist/build/output/log').${method}(${payload})
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

module.exports = [...nextScenarios]
module.exports.next = nextScenarios
