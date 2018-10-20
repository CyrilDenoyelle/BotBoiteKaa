
const on100 = (chances) => {
  return (Math.random() * 100 <= chances);
}

module.exports = {
  on100
}