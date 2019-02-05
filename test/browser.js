var fs = require('fs')
var image = require('get-image-data')
var load = require('./images/load')(image)
var runner = require('./runner')
var huey = require('../')

var images = {
  trad: fs.readFileSync(__dirname + '/images/trad.txt'),
  jerry: fs.readFileSync(__dirname + '/images/jerry.txt'),
  astronaut: fs.readFileSync(__dirname + '/images/astronaut.txt')
}

load(images, function (err, data) {
  console.assert(err === null)
  if (!err) runner(huey, data)
})
