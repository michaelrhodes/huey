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
