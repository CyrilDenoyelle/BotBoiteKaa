
const on100 = (chances) => {
  return (Math.random() * 100 <= chances);
}


const onArray = (arr) => {
  console.log('arr.length rand.js', arr.length);
  return arr[Math.floor(Math.random() * arr.length - 1)];
}

module.exports = {
  on100,
  onArray
}