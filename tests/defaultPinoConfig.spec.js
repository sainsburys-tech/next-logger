const { exec } = require('child_process')
const { promisify } = require('util')

const execAsync = promisify(exec)

describe('defaultPinoConfig', () => {
  const logArgs = async (args, method = 'info') => {
    // This is needed to escape double quotes in arguments. For example, turning "Hello World" into \"Hello World\"
    const safeArgs = args
      .map((arg) => String(arg).replace(/"/g, '\\"'))
      .join(',')
    const process = execAsync(
      `node -e "require('pino')(require('./lib/defaultPinoConfig')).${method}(${safeArgs})"`,
    )
    const { stdout } = await process
    return JSON.parse(stdout.trim())
  }

  describe('default Pino signatures', () => {
    it('logs a single string parameter', async () => {
      const output = await logArgs(['"Hello World"'])
      expect(output).toMatchObject({
        msg: 'Hello World',
      })
    })

    it('logs a single object parameter', async () => {
      const output = await logArgs([
        '{ foo: "bar", zoo: 45 }',
      ])
      expect(output).toMatchObject({
        foo: 'bar',
        zoo: 45,
      })
    })

    it('logs a single error parameter', async () => {
      const output = await logArgs([
        'new Error("Boom")',
      ])
      expect(output).toMatchObject({
        err: { message: 'Boom', type: 'Error' },
        msg: 'Boom',
      })
      expect(output.err.stack).toMatch(
        /Error: Boom\n *?at \[eval\]/,
      )
    })

    it('logs a merging object and message', async () => {
      const output = await logArgs([
        '{ foo: "bar", zoo: 45 }',
        '"Hello World"',
      ])
      expect(output).toMatchObject({
        foo: 'bar',
        zoo: 45,
        msg: 'Hello World',
      })
    })

    it('logs a merging object and message, with interpolation values', async () => {
      const output = await logArgs([
        '{ foo: "bar", zoo: 45 }',
        '"Hello %s %o"',
        '"World"',
        '{ name: "Name!" }',
      ])
      expect(output).toMatchObject({
        foo: 'bar',
        zoo: 45,
        msg: 'Hello World {"name":"Name!"}',
      })
    })

    it('logs a merging object and message, discarding non-interpolated values', async () => {
      const output = await logArgs([
        '{ foo: "bar", zoo: 45 }',
        '"Hello %s"',
        '"World"',
        '{ name: "Name!" }',
      ])
      expect(output).toMatchObject({
        foo: 'bar',
        zoo: 45,
        msg: 'Hello World',
      })
    })

    it('logs an error and message', async () => {
      const output = await logArgs([
        'new Error("Boom")',
        '"Hello World"',
      ])
      expect(output).toMatchObject({
        err: { message: 'Boom', type: 'Error' },
        msg: 'Hello World',
      })
      expect(output.err.stack).toMatch(
        /Error: Boom\n *?at \[eval\]/,
      )
    })

    it('logs an error and message, with interpolation values', async () => {
      const output = await logArgs([
        'new Error("Boom")',
        '"Hello %s %o"',
        '"World"',
        '{ name: "Name!" }',
      ])
      expect(output).toMatchObject({
        err: { message: 'Boom', type: 'Error' },
        msg: 'Hello World {"name":"Name!"}',
      })
      expect(output.err.stack).toMatch(
        /Error: Boom\n *?at \[eval\]/,
      )
    })

    it('logs an error and message, discarding non-interpolated values', async () => {
      const output = await logArgs([
        'new Error("Boom")',
        '"Hello %s"',
        '"World"',
        '{ name: "Name!" }',
      ])
      expect(output).toMatchObject({
        err: { message: 'Boom', type: 'Error' },
        msg: 'Hello World',
      })
      expect(output.err.stack).toMatch(
        /Error: Boom\n *?at \[eval\]/,
      )
    })

    it('handles a swapped merging object and message', async () => {
      const output = await logArgs([
        '"Hello World"',
        '{ foo: "bar", zoo: 45 }',
      ])
      expect(output).toMatchObject({
        foo: 'bar',
        zoo: 45,
        msg: 'Hello World',
      })
    })

    it('handles a swapped merging object and message, with interpolation values', async () => {
      const output = await logArgs([
        '"Hello %s %o"',
        '{ foo: "bar", zoo: 45 }',
        '"World"',
        '{ name: "Name!" }',
      ])
      expect(output).toMatchObject({
        foo: 'bar',
        zoo: 45,
        msg: 'Hello World {"name":"Name!"}',
      })
    })

    it('handles a swapped merging object and message, discarding non-interpolated values', async () => {
      const output = await logArgs([
        '"Hello %s"',
        '{ foo: "bar", zoo: 45 }',
        '"World"',
        '{ name: "Name!" }',
      ])
      expect(output).toMatchObject({
        foo: 'bar',
        zoo: 45,
        msg: 'Hello World',
      })
    })

    it('handles a swapped error and message', async () => {
      const output = await logArgs([
        '"Hello World"',
        'new Error("Boom")',
      ])
      expect(output).toMatchObject({
        err: { message: 'Boom', type: 'Error' },
        msg: 'Hello World',
      })
      expect(output.err.stack).toMatch(
        /Error: Boom\n *?at \[eval\]/,
      )
    })

    it('handles a swapped error and message, with interpolation values', async () => {
      const output = await logArgs([
        '"Hello %s %o"',
        'new Error("Boom")',
        '"World"',
        '{ name: "Name!" }',
      ])
      expect(output).toMatchObject({
        err: { message: 'Boom', type: 'Error' },
        msg: 'Hello World {"name":"Name!"}',
      })
      expect(output.err.stack).toMatch(
        /Error: Boom\n *?at \[eval\]/,
      )
    })

    it('handles a swapped error and message, discarding non-interpolated values', async () => {
      const output = await logArgs([
        '"Hello %s"',
        'new Error("Boom")',
        '"World"',
        '{ name: "Name!" }',
      ])
      expect(output).toMatchObject({
        err: { message: 'Boom', type: 'Error' },
        msg: 'Hello World',
      })
      expect(output.err.stack).toMatch(
        /Error: Boom\n *?at \[eval\]/,
      )
    })
  })

  describe('console-like string handling', () => {
    it('concatenates arguments into a single message, if all are strings', async () => {
      const output = await logArgs([
        '"Hello"',
        '"World"',
      ])
      expect(output).toMatchObject({
        msg: 'Hello World',
      })
    })

    it('concatenates arguments into a single message, stringifying numbers', async () => {
      const output = await logArgs([
        '"Hello"',
        '"World"',
        '3000',
      ])
      expect(output).toMatchObject({
        msg: 'Hello World 3000',
      })
    })
  })

  describe('JSON object building', () => {
    it('aggregates all objects into the log', async () => {
      const output = await logArgs([
        '{ foo: "bar" }',
        '{ zoo: 45 }',
      ])
      expect(output).toMatchObject({
        foo: 'bar',
        zoo: 45,
      })
    })

    it('aggregates all objects into the log, with precedence for later keys', async () => {
      const output = await logArgs([
        '{ foo: "bar" }',
        '{ zoo: 45 }',
        '{ zoo: 99 }',
      ])
      expect(output).toMatchObject({
        foo: 'bar',
        zoo: 99,
      })
    })

    it('aggregates all objects into the log, concatenating strings into a message', async () => {
      const output = await logArgs([
        '{ foo: "bar" }',
        '{ zoo: 45 }',
        '"Hello"',
        '"World"',
        '{ zoo: 99 }',
        '3000',
      ])
      expect(output).toMatchObject({
        foo: 'bar',
        zoo: 99,
        msg: 'Hello World 3000',
      })
    })

    it('aggregates all objects into the log, handling error objects', async () => {
      const output = await logArgs([
        '{ foo: "bar" }',
        '{ zoo: 45 }',
        'new Error("Boom")',
      ])
      expect(output).toMatchObject({
        foo: 'bar',
        zoo: 45,
        err: { message: 'Boom', type: 'Error' },
        msg: 'Boom',
      })
      expect(output.err.stack).toMatch(
        /Error: Boom\n *?at \[eval\]/,
      )
    })

    it('aggregates all objects into the log, handling error objects, with the concatenated message taking precedence', async () => {
      const output = await logArgs([
        '{ foo: "bar" }',
        '{ zoo: 45 }',
        '"Hello"',
        'new Error("Boom")',
        '"World"',
        '3000',
      ])
      expect(output).toMatchObject({
        foo: 'bar',
        zoo: 45,
        err: { message: 'Boom', type: 'Error' },
        msg: 'Hello World 3000',
      })
      expect(output.err.stack).toMatch(
        /Error: Boom\n *?at \[eval\]/,
      )
    })
  })
})
