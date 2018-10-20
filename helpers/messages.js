
const reunion = require('./reunionsHandler.js');
const msgTemplate = require('./botResponseTemplates');
const rand = require('./secondary/rand');

msgHandler = (msg) => {
  if (msg.author.id !== process.env.SELF_ID) {
    console.log('msg.author.id', msg.author.id);
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

    if (msg.content.toLowerCase().includes('bite') || msg.content.toLowerCase().includes('queue')) {
      msg.react("🍆");
    }

    if (msg.content.toLowerCase().startsWith('!reunion') || msg.content.toLowerCase().startsWith('!réunion')) {
      reunion.msgHandler(msg)
        .then(e => {
          if (e && e.msgTemplateName) {
            msgTemplate[e.msgTemplateName](msg, e.payload);
          } else if (e.tutoName) {
            msg.reply(msgTemplate.tutos[e.tutoName]);
          }
        })
        .catch(e => {
          console.log('error', e);
          if (e.tutoName) msg.reply(msgTemplate.tutos[e.tutoName]);
        });
    }

    if (msg.content.startsWith('?reunion')) {
      msg.reply(msgTemplate.tutos['reunion']);
    }
  }
}
module.exports = {
  msgHandler
}