
const on100 = (chances) => {
  return (Math.random() * 100 <= chances);
}


const onArray = (arr) => {
  const r = Math.floor(Math.random() * arr.length - 1)
  const out = arr[r];
  return out;
}

module.exports = {
  on100,
  onArray
}