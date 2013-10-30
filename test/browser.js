var fs = require('fs')
var huey = require('../')

require('./shared')(huey, {
  trad: fs.readFileSync(__dirname + '/images/trad.txt'),
  jerry: fs.readFileSync(__dirname + '/images/jerry.txt'),
  astronaut: fs.readFileSync(__dirname + '/images/astronaut.txt')
})
