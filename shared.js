var is = function(variable, type) {
  return variable && typeof variable === type
}

exports.invalid = function(path, callback) {
  var message = 
  (path === undefined)  ?
    'Please provide an image path.' :
  (is(callback, 'function') === false) ?
    'Please provide a callback function.' :
  null

  return (message ?
    new Error(message) :
    false
  )
}

exports.getImageData = require('get-image-data')

exports.getMostFrequentColor = function(data) {
  var dataLength = data.length
  var colorCount = {}
  var highestColorCount = 0
  var jump = (
    dataLength < 1e4 ? 24 :
    dataLength < 1e5 ? 56 :
    dataLength < 1e6 ? 512 :
    dataLength < 1e7 ? 768 :
    dataLength < 1e8 ? 10240 :
    12288
  )
  var mostFrequentColor, rgb, min, max
  for (var i = 0; i < dataLength; i += jump) {
    rgb = [data[i], data[i + 1], data[i + 2]]
    min = Math.min(rgb[0], Math.min(rgb[1], rgb[2]))
    max = Math.max(rgb[0], Math.max(rgb[1], rgb[2]))
    if (max - min < 24) {
      continue
    }
    rgb = rgb.join(',')
    colorCount[rgb] = (
      colorCount.hasOwnProperty(rgb) ?
      ++colorCount[rgb] : 1
    )
  }
  for (rgb in colorCount) {
    if (colorCount[rgb] < highestColorCount) {
      continue
    }
    highestColorCount = colorCount[rgb]
    mostFrequentColor = rgb
  }
  if (!mostFrequentColor) {
    return null
  }
  return mostFrequentColor.split(',')
    .map(function(value) {
      return parseInt(value, 10)
    })
}
