var path = require('path')
var image = require('get-image-data')
var load = require('./images/load')(image)
var runner = require('./runner')
var huey = require('../')

var images = {
  trad: path.join(__dirname, 'images/trad.jpg'),
  jerry: path.join(__dirname, 'images/jerry.jpg'),
  astronaut: path.join(__dirname,'/images/astronaut.jpg')
}

load(images, function (err, data) {
  console.assert(err === null)
  if (!err) runner(huey, data)
})
