var image = require('get-image-data')
var validate = require('./validate')
var is = require('./type-check')

module.exports = function (fn) {
  return function (path, n, callback) {
    if (is(n, 'function')) {
      callback = n
      n = null
    }

    var error = validate(path, callback)

    if (error) {
      if (!callback) throw error
      return setTimeout(callback, 0, error)
    }

    image(path, function(error, img) {
      if (error) return callback(error)
      var result = fn(img.data, n)
      callback(null, result, img)
    })
  } 
}
