var skip = require('./util/skip')

module.exports = dominant

function dominant (data) {
  var count = {}
  var max = 0
  var winner = null

  var i = 0, l = data.length
  var color, offset = skip(l)

  for (; i < l; i += offset) {
    color = hex(data[i]) +
      hex(data[i + 1]) +
      hex(data[i + 2])

    count[color] = (
      count[color] || 0
    ) + 1
  }

  for (color in count) {
    if (count[color] < max) continue
    max = count[color]
    winner = color
  }

  return winner
}

function hex (val) {
  return ('0' + val.toString(16)).substr(-2)
}
