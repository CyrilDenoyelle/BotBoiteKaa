module.exports = (text, arr) => {
  output = false;
  arr.map(str => {
    text.toLowerCase().includes(str) ? output = true : null;
  });
  return output;
}