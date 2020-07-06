module.exports = runner

function runner (huey, data) {
  assertRGBArray(huey.dominant(data.trad))
  assertRGBArray(huey.dominant(data.jerry))
  assertRGBArray(huey.dominant(data.astronaut))

  var palette = huey.palette(data.trad, 4)
  assertOk(Array.isArray(palette))
  assertOk(palette.length === 4)
  assertRGBArray(palette[0])
  assertRGBArray(palette[1])
  assertRGBArray(palette[2])
  assertRGBArray(palette[3])
}

function assertOk (result) {
  console.assert(result)
}

function assertRGBArray (result) {
  console.assert(Array.isArray(result))
  console.assert(result.length === 3)
  console.assert(typeof result[0] === 'number')
  console.assert(typeof result[1] === 'number')
  console.assert(typeof result[2] === 'number')
}
