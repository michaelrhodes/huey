# huey
huey is a little utility that finds the dominant colour of an image and returns it as an RGB array. It now works on the server as well as in the browser, and there’s also a command-line version.

[![Build status](https://travis-ci.org/michaelrhodes/huey.png?branch=master)](https://travis-ci.org/michaelrhodes/huey)

[![Browser support](https://ci.testling.com/michaelrhodes/huey.png)](https://ci.testling.com/michaelrhodes/huey)

### Demonstration
[http://michaelrhodes.github.io/huey/](http://michaelrhodes.github.io/huey/)

## Install

``` sh
$ npm install [-g] huey
```

## Usage

### Browser & Server
``` js
huey('./image.jpg', function(error, rgb, image) {
  var red = rgb[0]
  var green = rgb[1]
  var blue = rgb[2]

  // In case you want to do something
  // with the raw image data.
  console.log(
    image.data,
    image.height,
    image.width
  )
})
```

### CLI
``` sh
$ huey /path/to/image
=> r, g, b
```

## Server-implementation gotchas
huey depends on [get-image-data](https://github.com/michaelrhodes/get-image-data), which in turn depends on [node-canvas](https://github.com/Automattic/node-canvas). Although node-canvas is a great project, its dependencies can make it hard to install. If you run into problems, I recommend checking out their install guides on the [node-canvas wiki](https://github.com/Automattic/node-canvas/wiki).

## License
[MIT](http://opensource.org/licenses/MIT)
