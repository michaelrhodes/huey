var shared = require('./shared')

module.exports = function(path, callback) {
  var error = shared.invalid(path, callback) 

  if (error) {
    if (!callback) {
      throw error
    }
    callback(error)
    return
  }

  shared.getImageData(path, function(error, data) {
    if (error) {
      callback(error)
      return
    }
    var color = shared.getMostFrequentColor(data)
    callback(null, color)
  })
}
