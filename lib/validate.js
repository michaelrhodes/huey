var is = require('./type-check')

module.exports = function (path, callback) {
  var message = (
    is(path, 'undefined') ?
      'Please provide an image path.' :
    !is(callback, 'function') ?
      'Please provide a callback function.' :
    null
  )

  return message ? new Error(message) : false
}
