module.exports = skip

function skip (l) {
  return (
    l < 1e3 ? 4 :
    l < 1e4 ? 24 :
    l < 1e5 ? 56 :
    l < 1e6 ? 512 :
    l < 1e7 ? 768 :
    l < 1e8 ? 10240 :
    12288
  )
}
