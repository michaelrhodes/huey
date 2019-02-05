# huey
isomorphic dominant colour/palette extraction

[![build status](https://travis-ci.org/michaelrhodes/huey.svg?branch=master)](https://travis-ci.org/michaelrhodes/huey)

[![browser support](https://ci.testling.com/michaelrhodes/huey.png)](https://ci.testling.com/michaelrhodes/huey)

## install
```sh
npm install huey [get-image-data]
```

## use
```js
var image = require('get-image-data')
var dominant = require('huey/dominant')
var palette = require('huey/palette')

image('./image.jpg', function (err, img) {
  console.log(dominant(img.data))
  // => '7c3315'

  console.log(palette(img.data, 2))
  // => ['793217', 'f31517']
})
```

## obey
Copyright 2013–2019 Michael Rhodes

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
