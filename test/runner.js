var hex = /^[0-9a-f]{6}$/

module.exports = runner

function runner (huey, data) {
  var result

  result = huey.dominant(data.trad)
  console.assert(typeof result === 'string')
  console.assert(hex.test(result))

  result = huey.dominant(data.jerry)
  console.assert(typeof result === 'string')
  console.assert(hex.test(result))

  result = huey.dominant(data.astronaut)
  console.assert(typeof result === 'string')
  console.assert(hex.test(result))

  result = huey.palette(data.trad, 3)
  console.assert(Array.isArray(result))
  console.assert(result.length === 3)
  console.assert(hex.test(result[0]), result[0])
  console.assert(hex.test(result[1]))
  console.assert(hex.test(result[2]))
}
