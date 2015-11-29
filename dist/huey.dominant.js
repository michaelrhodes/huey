(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dominant = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var each = require('./lib/each')

module.exports = function (data) {
  var colorCount = {}
  var highestColorCount = 0
  var mostFrequentColor

  each(data, function (rgb) {
    rgb = rgb.join(',')
    colorCount[rgb] = (
      colorCount.hasOwnProperty(rgb) ?
      ++colorCount[rgb] : 1
    )
  })

  for (rgb in colorCount) {
    if (colorCount[rgb] < highestColorCount) continue
    highestColorCount = colorCount[rgb]
    mostFrequentColor = rgb
  }

  if (!mostFrequentColor) return null

  return mostFrequentColor
    .split(',')
    .map(function(value) {
      return parseInt(value, 10)
    })
}

},{"./lib/each":4}],2:[function(require,module,exports){
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

},{"./type-check":5,"./validate":6,"get-image-data":7}],3:[function(require,module,exports){
var wrap = require('./backwards-compatibility')
module.exports = wrap(require('../dominant'))

},{"../dominant":1,"./backwards-compatibility":2}],4:[function(require,module,exports){
module.exports = function (data, cb) {
  var dataLength = data.length

  // Skip every n channel values for performance
  var skip = (
    dataLength < 1e4 ? 24 :
    dataLength < 1e5 ? 56 :
    dataLength < 1e6 ? 512 :
    dataLength < 1e7 ? 768 :
    dataLength < 1e8 ? 10240 :
    12288
  )

  var rgb, min, max
  for (var i = 0; i < dataLength; i += skip) {
    rgb = [data[i], data[i + 1], data[i + 2]]
    min = Math.min(rgb[0], Math.min(rgb[1], rgb[2]))
    max = Math.max(rgb[0], Math.max(rgb[1], rgb[2]))

    if (max - min < 24) {
      continue
    }

    cb(rgb)
  }
}

},{}],5:[function(require,module,exports){
module.exports = function (variable, type) {
  return variable && typeof variable === type
}

},{}],6:[function(require,module,exports){
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

},{"./type-check":5}],7:[function(require,module,exports){
var get = require('get-image')
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

  get(path, function(error, image) {
    error ?
      callback(error) :
      callback(null, shared(canvas)(image))
  })
}

},{"./shared":9,"get-image":8}],8:[function(require,module,exports){
module.exports = function (src, callback) {
  var image = new Image

  if (!/^data/.test(src)) {
    image.crossOrigin = true
  }

  image.src = src
  image.onerror = callback
  image.onload = function () {
    callback(null, image)
  }
}

},{}],9:[function(require,module,exports){
module.exports = function(canvas) {
  return function(image) {
    var context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    context.drawImage(image, 0, 0)
    return context.getImageData(
      0, 0, image.width, image.height
    )
  }
}
 

},{}]},{},[3])(3)
});