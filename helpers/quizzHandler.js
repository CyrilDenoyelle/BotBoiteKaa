
// require
const kaaQuizz = require('./secondary/kaaQuizz');
const msgTemplate = require('./botResponseTemplates');

// local var
let quizzChannels = [];


const quizzCall = (msg) => {
  const quizzChannelsFiltered = getQuizzByChannelId(msg.channel.id);
  if (quizzChannelsFiltered.length > 1) { // si plusieurs quizz ont commencé dans le même channel
    console.log('problemos? quizzChannelsFiltered.length > 1\n quizzChannelsFiltered = ', quizzChannelsFiltered); // on log le souci
  }
  if (quizzChannelsFiltered.length >= 1) { // si au moins 1 quizz a commencé dans ce channel

    const quizzChannel = quizzChannelsFiltered[0]; // on prend le premier qui vient

    if (quizzChannel.inProgress) { // si le quizz trouvé est en cours 
      msg.channel.send(`La reponse précédente était: "${quizzChannel.answer}"`); // on donne la reponse
      quizzChannel.inProgress = false;
      // console.log('quizzChannels', quizzChannels);
    } else { // si non pas de quizz en cours on start un quizz dans le channel
      kaaQuizz.question()
        .then(({ citation, questionSubject, answer }) => {
          msg.channel.send(msgTemplate.quizzTemplateQuestion[questionSubject]({ citation }));
          quizzChannel.answer = answer; // set la reponse
          quizzChannel.inProgress = true;
          // console.log('quizzChannels', quizzChannels);
        });
    }
  } else { // si non pas de channel qui match donc on stock un nouveau quizzChannel et on start un quizz dans ce channel
    kaaQuizz.question()
      .then(({ citation, questionSubject, answer }) => {
        msg.channel.send(msgTemplate.quizzTemplateQuestion[questionSubject]({ citation }));

        quizzChannels.push({ // add new quizzChannel to list
          id: msg.channel.id,
          inProgress: true,
          answer
        })
        // console.log('quizzChannels', quizzChannels);
      });
  }
}

const quizzResponse = (msg) => {
  const quizzChannelsFiltered = getQuizzByChannelId(msg.channel.id);
  if (quizzChannelsFiltered.length > 1) { // si plusieurs quizz ont commencé dans le même channel
    console.log('problemos? quizzChannelsFiltered.length > 1\n quizzChannelsFiltered = ', quizzChannelsFiltered); // on log le souci
  }

  if (quizzChannelsFiltered.length >= 1) {
    const quizzChannel = quizzChannelsFiltered[0]; // on prend le premier
    if (quizzChannel.inProgress && msg.content.toLowerCase() === quizzChannel.answer.toLowerCase()) {
      // si il est en cours et que le message est la bonne reponse
      msg.channel.send('Bonne réponse');
      quizzChannel.inProgress = false
    }
  }
  // console.log('quizzChannels', quizzChannels);
}

const getNumberOfQuizzInProgress = () => {
  return quizzChannels.length > 0 ? quizzChannels.filter((quizzChan) => quizzChan.inProgress).length : 0;
}

const getQuizzByChannelId = (id) => {
  return quizzChannels.filter((quizzChan) => quizzChan.id === id);
}

module.exports = {
  quizzCall,
  quizzResponse,
  getNumberOfQuizzInProgress
}