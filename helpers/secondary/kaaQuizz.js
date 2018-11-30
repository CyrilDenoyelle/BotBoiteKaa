
const request = require('request');
const { clearSpaces } = require('./strutils');
const { onArray } = require('./rand');

const question = () => new Promise(resolve => request('https://kaamelott.chaudie.re/api/random', { json: true }, (err, res) => {
  if (err) { console.log('err', err); }
  const { body: { citation: { citation, infos } } } = res;
  const keys = ['personnage', 'saison'];
  const randKey = onArray(keys);
  const questionSubject = infos[randKey] ? randKey : 'saison';
  const answer = infos[questionSubject];

  resolve({ citation: clearSpaces(citation), questionSubject, answer: clearSpaces(answer) });
}));

module.exports = {
  question
};
