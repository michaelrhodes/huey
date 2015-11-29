(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.palette = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./type-check":5,"./validate":6,"get-image-data":7}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
/*!
 *  MMCQ.js
 *  Copyright (C) 2014 Nikola Klaric. MIT Licensed.
 *
 *  Derived from original work created by Nick Rabinovitz,
 *  and licensed under the MIT License.
 *
 *  http://opensource.org/licenses/mit-license.php
 */
module.exports = (function (_Math) {
  var histogram, _min = _Math.min, _max = _Math.max

  function x (a, b) {
    return a.c() - b.c()
  }

  function y (a, b) {
    return a.c() * a.v() - b.c() * b.v()
  }

  /**
   *  Priority queue.
   */
  function PQueue (comparator) {
    var contents = [],
      sorted = 0

    return {
      u: function (o) { /* push */
        contents.push(o)
        sorted = 0
      },
      o: function () { /* pop */
        if (!sorted) {
          contents.sort(comparator)
          sorted = 1
        }
        return contents.pop()
      },
      s: function () { /* size */
        return contents.length
      },
      m: function (f) { /* map */
        return contents.map(f)
      }
    }
  }

  /**
   *  3D colorspace box.
   */
  function VBox (r1, r2, g1, g2, b1, b2, histogram) {
    var vbox = this
    vbox.r1 = r1; vbox.r2 = r2
    vbox.g1 = g1; vbox.g2 = g2
    vbox.b1 = b1; vbox.b2 = b2
    vbox.h = histogram
  }
  VBox.prototype = {
    v: function () { /* volume */
      var vbox = this
      if (!vbox.V) {
        vbox.V = (vbox.r2 - vbox.r1 + 1) * (vbox.g2 - vbox.g1 + 1) * (vbox.b2 - vbox.b1 + 1)
      }
      return vbox.V
    },
    c: function () { /* count */
      var vbox = this
      if (!vbox.S) {
        var histogram = vbox.h,
          pixelCount = 0,
          rA = vbox.r1 - 1, rB = vbox.r2 + 1, gA, gB, bA, bB
        while (++rA < rB) {
          gA = vbox.g1 - 1; gB = vbox.g2 + 1
          while (++gA < gB) {
            bA = vbox.b1 - 1; bB = vbox.b2 + 1
            while (++bA < bB) {
              pixelCount += (histogram[1024 * rA + 32 * gA + bA] || 0)
            }
          }
        }

        vbox.C = pixelCount
        vbox.S = 1
      }
      return vbox.C
    },
    a: function () { /* avg */
      var vbox = this, histogram = vbox.h
      if (!vbox.A) {
        var ntot = 0,
          rsum = 0, gsum = 0, bsum = 0,
          hval,
          rA = vbox.r1 - 1, rB = vbox.r2 + 1, gA, gB, bA, bB
        while (++rA < rB) {
          gA = vbox.g1 - 1; gB = vbox.g2 + 1
          while (++gA < gB) {
            bA = vbox.b1 - 1; bB = vbox.b2 + 1
            while (++bA < bB) {
              hval = histogram[1024 * rA + 32 * gA + bA]
              if (hval) {
                ntot += hval
                rsum += hval * (0.5 + rA); gsum += hval * (0.5 + gA); bsum += hval * (0.5 + bA)
              }
            }
          }
        }
        if (ntot) {
          vbox.A = [~~(8 * rsum / ntot), ~~(8 * gsum / ntot), ~~(8 * bsum / ntot)]
        } else {
          /* Empty box. */
          vbox.A = [~~(4 * (1 + vbox.r1 + vbox.r2)), ~~(4 * (1 + vbox.g1 + vbox.g2)), ~~(4 * (1 + vbox.b1 + vbox.b2))]
        }
      }
      return vbox.A
    }
  }

  function _iterate (lh, target) {
    var ncolors = 1, niters = 0, count2,
      rw, gw, bw, maxw, i, j, k, dim,
      partialsum, lookaheadsum,
      total, sum,
      vbox,
      r1, r2, g1, g2, b1, b2,
      index, endA, endB, endC,
      left, right, vbox1, vbox2, d2,
      val1, val2

    while (niters < 1000) {
      vbox = lh.o()
      if (!vbox.c()) {
        lh.u(vbox); /* .push() */
        niters++
        continue
      }

      r1 = vbox.r1; r2 = vbox.r2; g1 = vbox.g1; g2 = vbox.g2; b1 = vbox.b1; b2 = vbox.b2
      rw = 1 + r2 - r1; gw = 1 + g2 - g1; bw = 1 + b2 - b1
      maxw = _max.call(0, rw, gw, bw)
      total = 0
      partialsum = []; lookaheadsum = []

      /* Find the partial sum arrays along the selected axis. */
      if (maxw == rw) {
        val1 = r1; val2 = r2
        dim = 'r'; endA = r2 + 1; endB = g2 + 1; endC = b2 + 1
        for (i = r1; i < endA; i++) {
          sum = 0
          for (j = g1; j < endB; j++) {
            for (k = b1; k < endC; k++) {
              sum += (histogram[1024 * i + 32 * j + k] || 0)
            }
          }
          total += sum
          partialsum[i] = total
        }
      } else if (maxw == gw) {
        val1 = g1; val2 = g2
        dim = 'g'; endA = g2 + 1; endB = r2 + 1; endC = b2 + 1
        for (i = g1; i < endA; i++) {
          sum = 0
          for (j = r1; j < endB; j++) {
            for (k = b1; k < endC; k++) {
              sum += (histogram[32 * i + 1024 * j + k] || 0)
            }
          }
          total += sum
          partialsum[i] = total
        }
      } else { /* maxw == bw */
        val1 = b1; val2 = b2
        dim = 'b'; endA = b2 + 1; endB = r2 + 1; endC = g2 + 1
        for (i = b1; i < endA; i++) {
          sum = 0
          for (j = r1; j < endB; j++) {
            for (k = g1; k < endC; k++) {
              sum += (histogram[1024 * j + 32 * k + i] || 0)
            }
          }
          total += sum
          partialsum[i] = total
        }
      }

      total /= 2
      index = partialsum.length
      while (index--) {
        if (partialsum[index]) {
          lookaheadsum[index] = total - partialsum[index]
        }
      }

      /* Determine the cut planes. */
      for (i = val1; i <= val2; i++) {
        if (partialsum[i] > total) {
          left = i - val1; right = val2 - i
          d2 = (left > right) ? _max(val1, ~~(i - 1 - left / 2)) : _min(val2 - 1, ~~(i + right / 2))

          /* Avoid 0-count boxes. */
          while (!partialsum[d2]) {
            d2++
          }
          count2 = lookaheadsum[d2]
          while (!count2 && partialsum[d2 - 1]) {
            count2 = lookaheadsum[--d2]
          }

          /* Set dimensions. */
          vbox1 = new VBox(r1, r2, g1, g2, b1, b2, vbox.h); vbox1[dim + '2'] = d2
          vbox2 = new VBox(r1, r2, g1, g2, b1, b2, vbox.h); vbox2[dim + '1'] = d2 + 1

          break
        }
      }

      lh.u(vbox1); /* .push() */
      if (vbox2) {
        lh.u(vbox2); /* .push() */
        ncolors++
      }
      if (ncolors >= target || niters++ > 1000) {
        return
      }
    }
  }

  function quantize (pixels, maxcolors) {
    histogram = []

    var colorMap = new PQueue(y),
      index,
      rmin = 32, rmax = 0,
      gmin = 32, gmax = 0,
      bmin = 32, bmax = 0,
      pixel, rval, gval, bval,
      queueA = new PQueue(x), queueB = new PQueue(y),
      pixelIndex = pixels.length

    while (pixelIndex) {
      pixel = pixels[--pixelIndex]
      rval = pixel[0] >> 3
      gval = pixel[1] >> 3
      bval = pixel[2] >> 3

      if (rval < rmin) {
        rmin = rval
      } else if (rval > rmax) {
        rmax = rval
      }

      if (gval < gmin) {
        gmin = gval
      } else if (gval > gmax) {
        gmax = gval
      }

      if (bval < bmin) {
        bmin = bval
      } else if (bval > bmax) {
        bmax = bval
      }

      index = 1024 * rval + 32 * gval + bval
      histogram[index] = (histogram[index] || 0) + 1
    }
    queueA.u(new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histogram)); /* .push() */

    /* First set of colors, sorted by population. */
    _iterate(queueA, 0.75 * maxcolors)

    /* Re-sort by the product of pixel occupancy times the size in color space: npix * volume. */
    while (queueA.s()) { /* .size() */
      queueB.u(queueA.o()); /* .push() .pop() */
    }

    /* Next set, generate the median cuts using the npix * volume sorting. */
    _iterate(queueB, maxcolors - queueB.s()); /* .size() */

    /* Calculate the actual colors. */
    while (queueB.s()) { /* .size() */
      colorMap.u(queueB.o()); /* .push() .pop() */
    }

    return colorMap.m(function (vb) { /* .map() */
      return vb.a(); /* .avg() */
    })
  }

  return quantize
})(Math)

},{}],4:[function(require,module,exports){
var wrap = require('./backwards-compatibility')
module.exports = wrap(require('../palette'))

},{"../palette":10,"./backwards-compatibility":1}],5:[function(require,module,exports){
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
 

},{}],10:[function(require,module,exports){
var each = require('./lib/each')
var quantize = require('./lib/mmcq')

module.exports = function (data, n) {
  n = isNaN(n) ? 5 : n
  var colors = []
  each(data, function (rgb) {
    colors.push(rgb)
  })

  // Sometimes quantize is a weirdo and returns
  // more or less colors than you actually asked for…
  return quantize(colors, n !== 255 ? n + 1 : n).slice(0, n)
}

},{"./lib/each":2,"./lib/mmcq":3}]},{},[4])(4)
});