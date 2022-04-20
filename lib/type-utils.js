// IDEALLY: convert callers to Object.hasOwn once that is implemented: https://github.com/microsoft/TypeScript/issues/44253
/** @type {import('./types').hasOwn} */
const hasOwn = (record, key) => {
  return Object.prototype.hasOwnProperty.call(
    record,
    key,
  )
}

module.exports = { hasOwn }
