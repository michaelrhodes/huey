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
