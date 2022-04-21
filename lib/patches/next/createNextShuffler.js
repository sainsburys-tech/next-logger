/** @return {import('../../types').nextShuffler} */
const createNextShuffler = (
  /**
   * @type {keyof typeof import('next/dist/build/output/log').prefixes}
   */
  nextLoggerMethod,
) => {
  return (
    /** @type {Parameters<import('next/dist/build/output/log')[typeof nextLoggerMethod]>} */
    ...args
  ) => {
    // Note: args here do not include the `nextLogger.prefix` string: https://github.com/vercel/next.js/blob/ec7c911295f99f05e8a1dd37593d012dc20a7481/packages/next/build/output/log.ts#L6
    args.forEach((arg) => {
      if (typeof arg !== 'string') {
        const msg = [
          '[next-logger] next.js has a type error - received non-string argument:',
          `  type:${typeof arg}`,
        ].join('\n')
        // eslint-disable-next-line no-console
        console.error(msg, 'arg:', arg)
        throw new Error(msg)
      }
    })

    // label the label (kind of for debugging, but may be nice in general)
    return [
      `nextLogger.${nextLoggerMethod}: ${args.join(
        ' ',
      )}`,
    ]
  }
}

module.exports = { createNextShuffler }
