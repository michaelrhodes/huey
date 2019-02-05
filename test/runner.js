var expected = require('./expected')

module.exports = runner

function runner (huey, data) {
  var hex, palette

  hex = huey.dominant(data.trad)
  console.assert(typeof hex === 'string')
  console.assert(hex === expected.trad, hex, expected.trad)

  hex = huey.dominant(data.jerry)
  console.assert(typeof hex === 'string')
  console.assert(hex === expected.jerry, hex, expected.jerry)

  hex = huey.dominant(data.astronaut)
  console.assert(typeof hex === 'string')
  console.assert(hex === expected.astronaut, hex, expected.astronaut)

  palette = huey.palette(data.trad, 3)
  console.assert(Array.isArray(palette))
  console.assert(palette.length === 3)
}
