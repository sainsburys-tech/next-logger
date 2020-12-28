# next-log

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
npm install next-log

# or for Yarn

yarn add next-log
```

Then add a [`NODE_OPTIONS`](https://nextjs.org/docs/api-reference/cli) string to your Next.js start script, to require in the logger.

```sh
NODE_OPTIONS='-r next-log' next start
```

### Adding to `package.json` Scripts

You can add this directly to your `package.json` scripts, to make it easier to start your service.

```json
"scripts": {
  "start": "NODE_OPTIONS='-r next-log' next start",
  // ...your other scripts
},
```
