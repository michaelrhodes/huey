huey
====

Huey is a little Javascript utility that finds the dominant colour of an image, then returns it as an RGB array.

usage
-----

```javascript
Huey("./image.jpg", function(rgb) {
  var red = rgb[0]
  var green = rgb[1]
  var blue = rgb[2]
})
```
