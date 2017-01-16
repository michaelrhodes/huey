# huey

huey is a little utility that finds the dominant colour or palette of an image. It works on the server as well as in the browser, and there’s also a command-line version.

[![Build status](https://travis-ci.org/michaelrhodes/huey.svg?branch=master)](https://travis-ci.org/michaelrhodes/huey)

[![Browser support](https://ci.testling.com/michaelrhodes/huey.png)](https://ci.testling.com/michaelrhodes/huey)

### Demonstration

<http://michaelrhodes.github.io/huey/>

## Install

```sh
$ npm install [-g] huey [canvas]
```
**note: canvas is not installed alongside huey**

huey requires [automattic/node-canvas](https://github.com/automattic/node-canvas) for its server/node variant, however, to avoid browser-only users from having to endure the native compilation process, it needs to be npm installed separately.

## Usage

### Recommended

```js
var image = require('get-image-data')
var dominant = require('huey/dominant')
var palette = require('huey/palette')

image('./image.jpg', function (error, img) {
  console.log(dominant(img.data))
  // => [124, 51, 21]

  console.log(palette(img.data, 2))
  // => [[121, 50, 23], [243, 21, 23]]
})
```

### Legacy

You should really only require code you need, but if you want the kitchen sink…

```js
var huey = require('huey')

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

huey.palette('./image.jpg', 2, function(error, palette, image) {
  palette.forEach(function (rgb) {
    var red = rgb[0]
    var green = rgb[1]
    var blue = rgb[2]
  })

  // In case you want to do something
  // with the raw image data.
  console.log(
    image.data,
    image.height,
    image.width
  )
})
```

#### Legacy page weight

| compression    |     size |
| :------------- | -------: |
| huey.js        | 13.29 kB |
| huey.min.js    |  5.57 kB |
| huey.min.js.gz |  2.36 kB |


### Legacy CLI

```sh
$ huey /path/to/image
=> r, g, b
```

## Server-implementation gotchas

huey depends on [get-image-data](https://github.com/michaelrhodes/get-image-data), which in turn depends on [node-canvas](https://github.com/Automattic/node-canvas). Although node-canvas is a great project, its dependencies can make it hard to install. If you run into problems, I recommend checking out their install guides on the [node-canvas wiki](https://github.com/Automattic/node-canvas/wiki).

## License

[MIT](http://opensource.org/licenses/MIT)
