const request = require('request');
const msgTemplate = require('../botResponseTemplates');

function* quizz(msg){

	request('https://kaamelott.chaudie.re/api/random', { json: true }, (err, res) => {
		if (err) { console.log(err); }
		const { body } = res;
		msg.channel.send(msgTemplate.quizzTemplateQuestionSaison({ body }))

	});
	//const answer = 
	yield 'Coucou';
	//console.log(answer);
}
const question = (msg)=>{
	return new Promise((resolve,rej) => {

		request('https://kaamelott.chaudie.re/api/random', { json: true }, (err, res) => {
			if (err) { console.log('err',err); }
			const { body } = res;
			msg.channel.send(msgTemplate.quizzTemplateQuestionSaison({ body }));
			resolve(body);
		});
	})
}
module.exports = {
	quizz,
	question
}
