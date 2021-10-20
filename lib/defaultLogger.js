const { format } = require('util')
const pino = require('pino')

module.exports = pino({
  hooks: {
    // https://getpino.io/#/docs/api?id=logmethod
    logMethod(args, method) {
      if (args.length < 2) {
        // If there's only 1 argument passed to the log method, use Pino's default behaviour.
        return method.apply(this, args)
      }

      if (typeof args[0] === 'object' && typeof args[1] === 'string') {
        // If the first argument is an object, and the second is a string, we assume that it's a merging
        // object and message, followed by interpolation values.
        // This matches Pino's logger signature, so use the default behaviour.
        return method.apply(this, args)
      }

      if (typeof args[0] === 'string' && typeof args[1] === 'object') {
        // If the first argument is a string, and the second is an object, swap them round to use the object
        // as a merging object for Pino.
        const arg1 = args.shift()
        const arg2 = args.shift()
        return method.apply(this, [arg2, arg1, ...args])
      }

      if (args.every(arg => typeof arg === 'string')) {
        // If every argument is a string, we assume they should be concatenated together.
        // This is to support the existing behaviour of console, where multiple string arguments are concatenated into a single string.
        return method.apply(this, [format(...args)])
      }

      // If the arguments can't be changed to match Pino's signature, collapse them into a single merging object.
      const messageParts = []
      const mergingObject = {}

      args.forEach(arg => {
        if (Object.prototype.toString.call(arg) === '[object Error]') {
          // If the arg is an error, add it to the merging object in the same format Pino would.
          Object.assign(mergingObject, { err: arg, msg: arg.message })
        } else if (typeof arg === 'object') {
          // If the arg is an object, assign it's properties to the merging object.
          Object.assign(mergingObject, arg)
        } else {
          // Otherwise push it's value into an array for concatenation into a string.
          messageParts.push(arg)
        }
      })

      // Concatenate non-object arguments into a single string message.
      const message = messageParts.length > 0 ? format(...messageParts) : undefined

      return method.apply(this, [mergingObject, message])
    },
  },
})
