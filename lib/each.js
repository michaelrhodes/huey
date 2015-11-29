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
