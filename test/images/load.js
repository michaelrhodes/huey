module.exports = function (image) {
  return function load (path, cb) {
    image(path.trad, function (err, trad) {
      if (err) return cb(err)

      image(path.jerry, function (err, jerry) {
        if (err) return cb(err)

        image(path.astronaut, function (err, astronaut) {
          err ? cb(err) : cb(null, {
            trad: trad.data,
            jerry: jerry.data,
            astronaut: astronaut.data
          })
        })
      })
    })
  }
}
