# next-logger

JSON logging patcher for Next.js

## Fork notes

See open PR in original repo from @atkinchris: https://github.com/atkinchris/next-logger/pull/15

## Description

This is a library to patch the logging functions used by [Next.js](https://nextjs.org/), to have them output to `stdout` as newline-delimited JSON. This allows a Next.js application to log service events in a format that's compatible with log aggregators, without needing a custom Next.js server.

This works by importing Next.js' inbuilt [logger](https://github.com/vercel/next.js/blob/canary/packages/next/build/output/log.ts) via `require`, and replacing the logging methods with custom ones. It uses [`pino`](https://github.com/pinojs/pino) to output JSON formatted logs, preserving Next.js' message and prefix, but adding timestamp, hostname and more.

From v2.0.0 onwards, this library also patches the global `console` methods, to catch additional logs that Next.js makes directly to `console`. While `pino` logging remains intact, this may cause issues with other libraries which patch or use `console` methods. Use the `next-only` preset to opt-out of this patching.

## Example Logs

Before:

```sh
ready - started server on http://localhost:3000
info  - Using external babel configuration from .babelrc
event - compiled successfully
```

After:

```json
{"level":30,"time":1609160882850,"pid":18493,"hostname":"MyHostname","name":"next.js","msg":"started server on http://localhost:3000","prefix":"ready"}
{"level":30,"time":1609160883607,"pid":18493,"hostname":"MyHostname","name":"next.js","msg":"Using external babel configuration from .babelrc","prefix":"info"}
{"level":30,"time":1609160885675,"pid":18493,"hostname":"MyHostname","name":"next.js","msg":"compiled successfully","prefix":"event"}
```

## Usage

First, install this package. You can do this with whatever Node package manager you're using in your project.

```sh
npm install next-logger

# or for Yarn

yarn add next-logger
```

Then add a [`NODE_OPTIONS`](https://nextjs.org/docs/api-reference/cli) string to your Next.js start script, to require in the logger.

```sh
NODE_OPTIONS='-r next-logger' next start
```

### Adding to `package.json` Scripts

You can add this directly to your `package.json` scripts, to make it easier to start your service.

```json
"scripts": {
  "start": "NODE_OPTIONS='-r next-logger' next start",
  // ...your other scripts
},
```

### Presets

To support opting out of some patches, this library supports "presets". These can be used as above, with `/presets/<PRESET_NAME>` appended, for example: `NODE_OPTIONS='-r next-logger/presets/next-only'`.

The following presets are supported:

- `next-logger/presets/all` - this includes all the patches this library supports. Using the library without a preset specified will use this preset.
- `next-logger/presets/next-only` - this only includes patches specifically for the Next.js logger object.

### Custom Logger

By default, this library uses an instance of Pino with a modified [`logMethod`](https://getpino.io/#/docs/api?id=logmethod), to give reasonable out-the-box behaviour for JSON logging. If you need logs in a different format, for example to change the message field or transform logged objects, you can provide your own instance of Pino to the library.

This is done by creating a `next-logger.config.js` file in the root of your project. The file should be a CommonJS module, and a function returning your custom Pino instance should be exported in a field called `logger`. This function will be called with the library's default Pino configuration, to allow you to extend it's behaviour (or completely replace it).

For example:

```js
// next-logger.config.js
const pino = require('pino')

const logger = defaultConfig =>
  pino({
    ...defaultConfig,
    messageKey: 'message',
    mixin: () => ({ name: 'custom-pino-instance' }),
  })

module.exports = {
  logger,
}
```

## Breaking Changes on >=1.0.0

This package name, `next-logger` has been inherited from [@frank47](https://github.com/franky47), who had deprecated their published logging middleware for Next.js. The original package and this one aim to solve similar problems for JSON logging in Next.js. However, the implementation and usage of this solution is significantly different from the original, which was published up to `v0.4.0`. To minimise unexpected issues for previous users of the original `next-logger`, the new package begins at major `v1.0.0`.
