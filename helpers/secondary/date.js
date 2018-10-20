
const days = (date, d) => date.setTime(date.getTime() + (d * 24 * 60 * 60 * 1000));
const hours = (date, h) => date.setTime(date.getTime() + (h * 60 * 60 * 1000));
const minutes = (date, m) => date.setTime(date.getTime() + (m * 60 * 1000));
const secondes = (date, s) => date.setTime(date.getTime() + (s * 1000));

module.exports = {
  days,
  hours,
  minutes,
  secondes
}