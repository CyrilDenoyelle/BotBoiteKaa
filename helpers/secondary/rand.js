
const on100 = (chances) => {
  return (Math.random() * 100 <= chances);
}


const onArray = (arr) => {
  console.log('arr rand.js', arr);
  return arr[Math.random() * arr.length - 1];
}

module.exports = {
  on100,
  onArray
}