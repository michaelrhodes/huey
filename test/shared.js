var run = require('tape').test
var expected = require('./expected')
var abs = Math.abs

module.exports = function(huey, path) {
  run('it works', function(test) {
    test.plan(3)
    huey(path.trad, function(error, rgb) {
      test.deepEqual(
        fix(rgb, expected.trad, 1),
        expected.trad,
        'trad.jpg'
      )
    })
    huey(path.jerry, function(error, rgb) {
      test.deepEqual(
        fix(rgb, expected.jerry, 1),
        expected.jerry,
        'jerry.jpg'
      )
    })
    huey(path.astronaut, function(error, rgb) {
      test.deepEqual(
        fix(rgb, expected.astronaut, 1),
        expected.astronaut,
        'astronaut.jpg'
      )
    })
  })
  
  run('it requires arguments', function(test) {
    test.plan(1)
    try {
      huey()
    }
    catch (error) {
      test.ok(error, error.message)
    }
  })
  
  run('it returns the image data', function(test) {
    test.plan(1)
    huey(path.trad, function(error, rgb, image) {
      test.ok(image, 'it does')
    })
  })

  run('it returns an image palette', function(test) {
    test.plan(2)
    huey.palette(path.trad, 3, function(error, palette) {
      test.ok(palette, 'it does')
      test.equal(palette.length, 3, 'it is the fix length')
    })
  })
}

function fix (a1, a2, n) {
  var i = 0, l = a1.length
  for (; i < l; i++)
    if (abs(a1[i] - a2[i]) > n)
      return a1
  return a2 
}
