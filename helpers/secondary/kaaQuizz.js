
const request = require('request');
const { onArray } = require('./rand');

const question = () => new Promise(resolve => request('https://kaamelott.chaudie.re/api/random', { json: true }, (err, res) => {
  if (err) { console.log('err', err); }
  const { body: { citation: { citation, infos } } } = res;
  const keys = ['personnage', 'saison'];
  const randKey = onArray(keys);
  const questionSubject = infos[randKey] ? randKey : 'saison';
  const answer = infos[questionSubject];

  resolve({ citation: citation.trim(), questionSubject, answer: answer.trim() });
}));

module.exports = {
  question
};
