var skip = require('./util/skip')

module.exports = dominant

function dominant (data, threshold) {
  threshold = threshold == null ||
    isNaN(threshold) ? 0 :
    Number(threshold)

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

    color = hex(r) + hex(g) + hex(b)
    count[color] = (count[color] || 0) + 1
  }

  for (color in count) {
    if (count[color] <= highest) continue
    highest = count[color]
    winner = color
  }

  return winner
}

function hex (val) {
  return ('0' + val.toString(16)).substr(-2)
}
