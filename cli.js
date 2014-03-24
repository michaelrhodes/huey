#!/usr/bin/env node

var huey = require('./')
var file = process.argv[2]

if (!file) {
  process.stderr.write('Please provide an image\n')
  process.exit(1)
}

huey(process.argv[2], function(error, color) {
  if (error) {
    process.stderr.write(error + '\n')
    process.exit(1)
  }

  process.stdout.write(
    color.join(', ') + '\n'
  )
  process.exit(0)
})
