var skip = require('./util/skip')
var num = require('./util/num')

module.exports = dominant

function dominant (data, threshold) {
  threshold = num(threshold, 0)

  var highest = 0
  var winner = null
  var count = {}

  var i = 0, l = data.length
  var r, g, b, min, max, color
  var offset = skip(l)

  for (; i < l; i += offset) {
    r = data[i]
    g = data[i + 1]
    b = data[i + 2]

    if (threshold) {
      min = Math.min(r, Math.min(g, b))
      max = Math.max(r, Math.max(g, b))
      if (max - min < threshold) continue
    }

    color = r + ',' + g + ',' + b
    count[color] = (count[color] || 0) + 1
  }

  for (color in count) {
    if (count[color] <= highest) continue
    highest = count[color]
    winner = color
  }

  return winner.split(',').map(Number)
}
