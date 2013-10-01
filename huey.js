Huey = (function(document, undefined) {
  var canvas = null
  var canvasSupported = (function(document) {
    canvas = document.createElement('canvas')
    return !!(canvas.getContext && canvas.getContext('2d'))
  })(document)

  var helper = {
    getImageData: function(image) {
      var context = canvas.getContext('2d')
      canvas.width = image.width
       canvas.height = image.height
      context.drawImage(image, 0, 0)
      return context.getImageData(0, 0, image.width, image.height).data
    },
    getMostFrequentColor: function(data) {
      var dataLength = data.length
      var colorCount = {}
      var highestColorCount = 0
      var jump = (
        dataLength < 1e4 ? 24 :
        dataLength < 1e5 ? 56 :
        dataLength < 1e6 ? 512 :
        dataLength < 1e7 ? 768 :
        dataLength < 1e8 ? 10240 :
        12288
      )
      var mostFrequentColor, rgb, min, max
      for (var i = 0; i < dataLength; i += jump) {
        rgb = [data[i], data[i + 1], data[i + 2]]
        min = Math.min(rgb[0], Math.min(rgb[1], rgb[2]))
        max = Math.max(rgb[0], Math.max(rgb[1], rgb[2]))
        if (max - min < 24) {
          continue
        }
        rgb = rgb.join(',')
        colorCount[rgb] = (colorCount.hasOwnProperty(rgb) ? ++colorCount[rgb] : 1)
      }
      for (rgb in colorCount) {
        if (colorCount[rgb] < highestColorCount) {
          continue
        }
        highestColorCount = colorCount[rgb]
        mostFrequentColor = rgb
      }
      if (!mostFrequentColor) {
        return null
      }
      return mostFrequentColor.split(',').map(function(value) {
        return parseInt(value, 10)
      })
    }
  }

  return function(url, callback) {
    var image, data, color
    if (canvasSupported && url && callback) {
      image = new Image()
      image.onload = function() {
        data = helper.getImageData(image)
        color = helper.getMostFrequentColor(data)
        callback(color)
      }
      if (!/^data/.test(url)) {
        image.crossOrigin = true
      }
      image.src = url
    }
  }
})(document)
