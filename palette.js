var hex = require('./util/hex')
var skip = require('./util/skip')
var quantize = require('./util/quantize')

module.exports = palette

function palette (data, n, threshold) {
  n = n == null ||
    isNaN(n) ? 5 :
    Number(n)

  threshold = threshold == null ||
    isNaN(threshold) ? 0 :
    Number(threshold)

  var i = 0, l = data.length
  var r, g, b, min, max, color
  var offset = skip(l)
  var colors = []

  for (; i < l; i += offset) {
    r = data[i]
    g = data[i + 1]
    b = data[i + 2]

    if (threshold) {
      min = Math.min(r, Math.min(g, b))
      max = Math.max(r, Math.max(g, b))
      if (max - min < threshold) continue
    }

    colors.push([r, g, b])
  }

  // Sometimes quantize is a weirdo and returns
  // more or less colors than you actually asked for…
  return quantize(colors, Math.min(255, n + 1))
    .slice(0, n)
    .map(function (rgb) {
      return hex(rgb[0]) +
        hex(rgb[1]) +
        hex(rgb[2])
    })
}
