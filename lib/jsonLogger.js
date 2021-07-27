const logger = require('pino')({ name: 'next.js' })

const getLogMethod = level => {
  switch (level) {
    case 'error':
      return logger.error.bind(logger)
    case 'warn':
      return logger.warn.bind(logger)
    default:
      return logger.info.bind(logger)
  }
}

const isError = obj => Object.prototype.toString.call(obj) === '[object Error]'

const getMessage = obj => {
  if (isError(obj)) {
    return obj.stack
  }
  if (obj.length === 1) {
    return obj[0]
  }
  return obj
}

const getMergingObject = (level, obj) => {
  if (isError(obj)) {
    const errorProps = Object.getOwnPropertyNames(obj).reduce(
      (props, prop) => ({
        ...props,
        [prop]: obj[prop],
      }),
      {}
    )
    return { prefix: level, ...errorProps }
  }
  return { prefix: level }
}

module.exports = prefix => {
  const logMethod = getLogMethod(prefix)

  return obj => {
    const message = getMessage(obj)
    const mergingObject = getMergingObject(prefix, obj)

    return logMethod(mergingObject, message)
  }
}
