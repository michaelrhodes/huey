#!/usr/bin/env node

var huey = require('./')

huey(process.argv[2], function(error, color) {
  if (error) {
    process.stderr.write(error)
    return
  }
  process.stdout.write(
    'rgb(' + color.join(', ') + ')\n'
  )
})
