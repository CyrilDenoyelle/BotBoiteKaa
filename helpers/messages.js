
// requires
const reunion = require('./reunionsHandler.js');
const { isWhiteListGuild } = require('./middlewares/guilds.js');
const msgTemplate = require('./botResponseTemplates');
const rand = require('./secondary/rand');
const dico = require('./secondary/dico');
const { reply: recastReply, talk } = require('./recastai/recastaiClient.js');
const { includesOneOf, startsWithOneOf } = require('./secondary/oneOf.js');
const request = require('request'); // https://kaamelott.chaudie.re/api/random
const kaaQuizz = require('./secondary/kaaQuizz');

// local var
let quizzInProgress = false;
let quizzChannel;
let quizzAnswer;


// request
const kaa = (msg) => {
  request('https://kaamelott.chaudie.re/api/random', { json: true }, (err, res) => {
    if (err) { console.log(err); }
    const { body } = res;
    msg.channel.send(msgTemplate.citationTemplate({ body }))
  });
}


msgHandler = (msg) => {
  // IN EVERY CASES
  // if (msg.content.toLowerCase().includes('bite') || msg.content.toLowerCase().includes('queue')) {
  if (includesOneOf(msg.content, ['bite', 'queue', 'zizi', 'prepu', 'organe genital', 'pine'])) {
    msg.react("🍆");
  }

  // IF NOT SELF MESSAGE
  if (msg.author.id !== process.env.SELF_ID) {
    // PING PONG
    if (msg.content.toLowerCase().includes('pong')) {
      msg.channel.send(`Ping ${rand.on100(10) ? 'biatch' : ''}`, {
        tts: true
      });
    }
    if (msg.content.toLowerCase().includes('ping')) {
      msg.channel.send(`Pong! ${rand.on100(10) ? 'biatch' : ''}`, {
        tts: true
      });
    }
    // KAAMELOTT-API
    if (includesOneOf(msg.content, ['kaa', 'kaamelott'])) {
      kaa(msg);
    }
    // Si le message contient quizz
    if (msg.content.toLowerCase().includes('quizz')) {
      // Initialisation d'un quizz
      if (quizzInProgress && msg.channel.id === quizzChannel) msg.channel.send(`La reponse précédente était ${quizzAnswer}`);
      quizzChannel = msg.channel.id;
      kaaQuizz.question(msg)
        .then(({ citation, questionSubject, answer }) => {
          msg.channel.send(msgTemplate.quizzTemplateQuestion[questionSubject]({ citation }));
          quizzAnswer = answer;
          quizzInProgress = true;
        });
    } else {
      if (msg.channel.id === quizzChannel && quizzInProgress) {
        if (msg.content.toLowerCase().includes(quizzAnswer.toLowerCase())) {
          msg.channel.send('Bonne réponse');
          quizzInProgress = false;
        }
      }
    }



    // DIRECT MESSAGES
    if (msg.guild === null) {
      if (msg.content.includes('kamoulox')) {
        msg.reply(rand.onArray(dico()));
      } else if (msg.content && msg.content.length > 0) {


        // talk(msg.content)
        //   .then((res) => {
        //     console.log(res.raw);
        //   });


        // recastReply({
        //   type: "message",
        //   value: {
        //     type: "text",
        //     content: msg.content
        //   }
        // }).then(res => {
        //   console.log('res recastai', res);
        // })
      }
    }

    // GUILD MIDDLEWARES
    //  || msg.author.id == process.env.ADMIN
    if (msg.guild && isWhiteListGuild(msg.guild.id)) {
      // REUNIONS
      if (startsWithOneOf(msg.content, ['!reunion', '!réunion'])) {
        reunion.msgHandler(msg)
          .then(e => {
            if (e && e.msgTemplateName) {
              msgTemplate[e.msgTemplateName](msg, e.payload)
                .then(sendedMsg => sendedMsg.delete(5 * 60 * 1000));// delete it after 5mins
            } else if (e.tutoName) {
              msg.reply(msgTemplate.tutos[e.tutoName])
                .then(sendedMsg => sendedMsg.delete(5 * 60 * 1000));// delete it after 5mins
            }
          })
          .catch(e => {
            if (e.tutoName) {
              msg.reply(msgTemplate.tutos[e.tutoName])
                .then(sendedMsg => sendedMsg.delete(5 * 60 * 1000));// delete it after 5mins
            }
            // setTimeout();
            console.log(`that message "${msg.content}" throwed this:`, e);
          });
      }

      // ask for reunion tuto
      if (msg.content.startsWith('?reunion')) {
        msg.reply(msgTemplate.tutos['reunion'])
          .then(e => e.delete(5 * 60 * 1000));// delete it after 5mins
      }
    }

  }
}
module.exports = {
  msgHandler
}