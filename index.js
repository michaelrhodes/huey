var fs = require('fs')
var Canvas = require('canvas')
var shared = require('./shared')

module.exports = function(path, callback) { 
  var error = shared.invalid(
    path, callback
  )

  if (error) {
    if (!callback) {
      throw error
    }
    callback(error)
    return
  }

  fs.readFile(path, function(error, file) {
    if (error) {
      callback(error)
      return
    }

    var image = new Canvas.Image
    image.src = file 
    
    var canvas = new Canvas(
      image.width, image.height
    )

    var huey = shared.helper(canvas)
    var data = huey.getImageData(image)
    var color = huey.getMostFrequentColor(data)

    callback(null, color)
  })  
}
