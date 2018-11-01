
const on100 = (chances) => {
  return (Math.random() * 100 <= chances);
}


const onArray = (arr) => {
  const r = Math.round(Math.random() * (arr.length - 1));
  return arr[r];
}

module.exports = {
  on100,
  onArray
}