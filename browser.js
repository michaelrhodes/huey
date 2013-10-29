var shared = require('./shared')

var canvas = null
var supported = (function(document) {
  canvas = document.createElement('canvas')
  return !!(canvas.getContext && canvas.getContext('2d'))
})(document)

module.exports = function(path, callback) {
  var error = shared.invalid(
    path, callback, supported
  ) 

  if (error) {
    if (!callback) {
      throw error
    }
    callback(error)
    return
  }

  var image = new Image 
  if (!/^data/.test(path)) {
    image.crossOrigin = true
  }

  image.src = path
  image.onload = function() {
    var huey = shared.helper(canvas)
    var data = huey.getImageData(image)
    var color = huey.getMostFrequentColor(data)
    callback(null, color)
  }
}
