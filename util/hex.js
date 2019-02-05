module.exports = hex

function hex (val) {
  return ('0' + val.toString(16)).substr(-2)
}
