/** @return {import('../../types').strictArgShuffler} */
const createStrictArgShufflerForPino = (
  /**
   * Other methods are not supported YET
   *
   * Having the consoleMethod will be key to supporting other methods in the future.
   *
   * @type {import('../../types').supportedConsoleMethods}
   */
  consoleMethod,
) => {
  return (
    /** @type {any[]} */
    ...args
  ) => {
    let [label, data, ...restArgs] = args
    // Sample: Add support for `console.group`:
    // if (consoleMethod === 'group') return ['group start: ' + label]

    // handle `label`
    if (typeof label !== 'string') {
      throw new Error(
        `[next-logger] createStrictArgShuffler: first console arg must be a string (it's currently a ${typeof label}) to ensure logs are easy to search and filter:`,
      )
    }

    // handle `data`
    if (typeof data === 'function') {
      data = data.toString()
    }
    if (typeof data === 'string') {
      label += ` ${data}`
      data = undefined
    }

    // handle `args`
    if (typeof restArgs !== 'undefined') {
      throw new Error(
        '[next-logger] only two args are supported.',
      )
    }

    // label the label (kind of for debugging, but may be nice in general)
    label = `console.${consoleMethod}: ${label}`

    if (data === undefined) {
      return [label]
    }
    // reverse order of args for Pino:
    // If first arg provided to pino is an object,
    // It will be serialized
    return [data, label]
  }
}

module.exports = { createStrictArgShufflerForPino }
