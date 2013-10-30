# huey
huey is a little utility that finds the dominant colour of an image and returns it as an RGB array. It now works on the server as well as in the browser, and there’s also a command-line version.

### Demonstration
[http://michaelrhodes.github.io/huey/](http://michaelrhodes.github.io/huey/)

<br />
[![Build status](https://travis-ci.org/michaelrhodes/huey.png?branch=master)](https://travis-ci.org/michaelrhodes/huey)

[![Browser support](https://ci.testling.com/michaelrhodes/huey.png)](https://ci.testling.com/michaelrhodes/huey)

## Install

``` sh
$ npm install [-g] huey
```

## Usage

### Browser & Server
``` js
huey('./image.jpg', function(error, rgb, data) {
  var red = rgb[0]
  var green = rgb[1]
  var blue = rgb[2]

  // In case you want to do something
  // with the raw image data.
  console.log(data)
})
```

### CLI
``` sh
$ huey /path/to/image
=> rgb(x, x, x)
```

### License
[MIT](http://opensource.org/licenses/MIT)
