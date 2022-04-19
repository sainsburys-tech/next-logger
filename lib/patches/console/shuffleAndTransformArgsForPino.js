const { format } = require('util')

/**
 * May throw errors in certain edge cases
 *
 * Return type is `[msg: string, ...args: any[]]`
 *
 * @type {import('../../types').argShuffler}
 */
const shuffleAndTransformArgsForPino = (args = []) => {
  const [arg0, arg1, ...restArgs] = args
  if (args.length === 1 && typeof arg0 === 'string') {
    // If there's only 1 argument passed to the log method, use Pino's default behaviour.
    return [arg0]
  }

  if (
    typeof arg0 === 'object' &&
    typeof arg1 === 'string' &&
    args.length === 2
  ) {
    // If the first argument is an object, and the second is a string, we assume that it's a merging
    // object and message, followed by interpolation values.
    // This matches Pino's logger signature, so use the default behaviour.
    return [arg0, arg1]
  }

  if (
    typeof arg0 === 'string' &&
    typeof arg1 === 'object'
  ) {
    // If the first argument is a string, and the second is an object, swap them round to use the object
    // as a merging object for Pino.
    return [arg1, arg0, ...restArgs]
  }

  if (args.every((arg) => typeof arg === 'string')) {
    // If every argument is a string, we assume they should be concatenated together.
    // This is to support the existing behaviour of console, where multiple string arguments are concatenated into a single string.
    return [format(...args)]
  }

  // If the arguments can't be changed to match Pino's signature, collapse them into a single merging object.
  /**
   * @type {any[]}
   */
  const messageParts = []
  /**
   * Really, truly, could be anything.
   * @type {{
   *   err?: Error | any
   *   msg?: string | any
   *   [x: string]: any
   * }}
   */
  let mergingObject = {}

  args.forEach((arg) => {
    if (
      Object.prototype.toString.call(arg) ===
      '[object Error]'
    ) {
      // If the arg is an error, add it to the merging object in the same format Pino would.
      if (mergingObject.err) {
        throw new Error(
          '[next-logger] cannot add two Error objects in one pino log',
        )
      }
      mergingObject = {
        ...mergingObject,
        err: arg,
        msg: arg.message,
      }
    } else if (typeof arg === 'object') {
      // If the arg is an object, assign it's properties to the merging object.
      mergingObject = {
        ...mergingObject,
        ...arg,
      }
    } else {
      // Otherwise push it's value into an array for concatenation into a string.
      messageParts.push(arg)
    }
  })

  // Concatenate non-object arguments into a single string message.
  const message =
    messageParts.length > 0
      ? format(...messageParts)
      : undefined

  // A different style of using Pino may not result in this type Error.
  // Something about `LogFn` seems incorrect, perhaps the return signature type?
  // @ts-expect-error
  return [mergingObject, message]
}

module.exports = { shuffleAndTransformArgsForPino }
