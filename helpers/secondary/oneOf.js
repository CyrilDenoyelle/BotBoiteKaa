

const includesOneOf = (text, arr) => {
  output = false;
  arr.map(str => {
    text.toLowerCase().includes(str) ? output = true : null;
  });
  return output;
}

const startsWithOneOf = (text, arr) => {
  output = false;
  arr.map(str => {
    text.toLowerCase().startsWith(str) ? output = true : null;
  })
  return output;
}

module.exports = {
  includesOneOf,
  startsWithOneOf
}