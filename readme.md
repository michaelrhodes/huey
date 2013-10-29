# huey
huey is a little utility that finds the dominant colour of an image and returns it as an RGB array. It now works on the server as well as in the browser.

[![Build status](https://travis-ci.org/michaelrhodes/huey.png?branch=master)](https://travis-ci.org/michaelrhodes/huey)

[![Browser support](https://ci.testling.com/michaelrhodes/huey.png)](https://ci.testling.com/michaelrhodes/huey)

## Install

``` sh
npm install huey
```

## Usage
``` js
huey('./image.jpg', function(error, rgb) {
  var red = rgb[0]
  var green = rgb[1]
  var blue = rgb[2]
})
```
Note: The browser and server APIs are identical!

### Browser demonstration
[http://michaelrhodes.github.io/huey/](http://michaelrhodes.github.io/huey/)

### License
[MIT](http://opensource.org/licenses/MIT)
