var skip = require('./util/skip')
var quantize = require('./util/quantize')

module.exports = palette

function palette (data, n) {
  n = n == null || isNaN(n) ? 5 : +n

  var i = 0, l = data.length
  var offset = skip(l)
  var colors = []

  for (; i < l; i += offset) colors.push([
    data[i], data[i + 1], data[i + 2]
  ])

  // Sometimes quantize is a weirdo and returns
  // more or less colors than you actually asked for…
  return quantize(colors, Math.min(255, n + 1))
    .slice(0, n)
}
