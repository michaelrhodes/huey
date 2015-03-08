!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.huey=e():"undefined"!=typeof global?global.huey=e():"undefined"!=typeof self&&(self.huey=e())}(function(){var define,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

  shared.getImageData(path, function(error, info) {
    if (error) {
      callback(error)
      return
    }
    var color = shared.getMostFrequentColor(info.data)
    callback(null, color, info)
  })
}

},{"./shared":4}],2:[function(require,module,exports){
var shared = require('./shared')

var canvas = null
var supported = (function(document) {
  canvas = document.createElement('canvas')
  return !!(
    canvas.getContext &&
    canvas.getContext('2d')
  )
})(document)

module.exports = function(path, callback) {
  if (!supported) {
    return callback(new Error(
      'Your browser doesn’t the ' +
      '<canvas> element'
    )) 
  }

  var image = new Image 
  if (!/^data/.test(path)) {
    image.crossOrigin = true
  }

  image.src = path
  image.onerror = callback
  image.onload = function() {
    var data = shared(canvas)
    callback(null, {
      data: data(image),
      height: image.height,
      width: image.width
    })
  }
}

},{"./shared":3}],3:[function(require,module,exports){
module.exports = function(canvas) {
  return function(image) {
    var context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    context.drawImage(image, 0, 0)
    var raw = context.getImageData(
      0, 0, image.width, image.height
    )
    return raw.data
  }
}
 

},{}],4:[function(require,module,exports){
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

},{"get-image-data":2}]},{},[1])
(1)
});
;