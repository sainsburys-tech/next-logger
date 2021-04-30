# next-logger

JSON logging patcher for Next.js

## Description

This is a library to patch the logging functions used by [Next.js](https://nextjs.org/), to have them output to `stdout` as newline-delimited JSON. This allows a Next.js application to log service events in a format that's compatible with log aggregators, without needing a custom Next.js server.

This works by importing Next.js' inbuilt [logger](https://github.com/vercel/next.js/blob/canary/packages/next/build/output/log.ts) via `require`, and replacing the logging methods with custom ones. It uses [`pino`](https://github.com/pinojs/pino) to output JSON formatted logs, preserving Next.js' message and prefix, but adding timestamp, hostname and more.

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

## Breaking Changes on >=1.0.0

This package name, `next-logger` has been inherited from [@frank47](https://github.com/franky47), who had deprecated their published logging middleware for Next.js. The original package and this one aim to solve similar problems for JSON logging in Next.js. However, the implementation and usage of this solution is significantly different from the original, which was published up to `v0.4.0`. To minimise unexpected issues for previous users of the original `next-logger`, the new package begins at major `v1.0.0`.
