module.exports = num

function num (val, def) {
  return val == null ||
    isNaN(val) ? def :
    Number(val)
}
