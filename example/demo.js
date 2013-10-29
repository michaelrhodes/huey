(function(document) {
  var loading = null
  var body = document.body
  var message = document.getElementById('message')
  var caption = document.getElementById('caption')
  var input = document.createElement('input')
  input.type = 'file'

  message.onclick = function() {
    input.click()
  }

  document.ondragover =
  document.ondragend = function (e) {
    e.preventDefault()
  }
  input.onchange =
  document.ondrop = function (e) {
    e.preventDefault()
    var file = (
      e.dataTransfer ?
        e.dataTransfer.files[0] :
        e.target.files[0]
    )
    if (!file) {
      return
    }
    message.innerHTML = 'Calculating…'
    var reader = new FileReader()
    reader.onload = function (e) {
      var url = e.target.result
      var start = new Date()

      huey(url, function(error, color) {
        var isGreyscale = !color
        color = color || [128,128,128]
        var total = color[0] + color[1] + color[2]
        var end = new Date()
        var time = (end.getTime() - start.getTime())

        body.style.cssText = [
          'background-color: rgb(' + color + ')',
          'background-image: url(' + url + ')'
        ].join('; ')

        message.style.cssText = [
          'background-color: rgb(' + color + ')',
          'color: ' + (total > 500 ? '#222' : '#fff')
        ].join('; ')

        message.innerHTML = (
          isGreyscale ?
            'Greyscale' :
            'rgb(' + color.join(',') + ')'
        )

        message.setAttribute('title', 'Calculated in ' + (
          time >= 1000 ?
            (time / 1000).toFixed(2) + 's' :
            time + 'ms')
        )
      })
    };
    reader.readAsDataURL(file)
  }
})(document)
