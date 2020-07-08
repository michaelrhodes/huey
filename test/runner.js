module.exports = runner

function runner (huey, data) {
  assertRGBArray(huey.dominant(data.trad))
  assertRGBArray(huey.dominant(data.jerry))
  assertRGBArray(huey.dominant(data.astronaut))
  assertNull(huey.dominant(data.astronaut, 255))

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

function assertNull (result) {
  assertOk(result === null)
}

function assertRGBArray (result) {
  assertOk(Array.isArray(result))
  assertOk(result.length === 3)
  assertOk(typeof result[0] === 'number')
  assertOk(typeof result[1] === 'number')
  assertOk(typeof result[2] === 'number')
}
