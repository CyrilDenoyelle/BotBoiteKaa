

const clearSpaces = (str) => { // remove space at start and end of a string
  if (str.split('')[str.length - 1] === ' ') str = str.slice(0, str.length - 1);
  if (str.split('')[0] === ' ') str = str.slice(1);
  return str;
}

module.exports = {
  clearSpaces
}