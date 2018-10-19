
const reunion = require('./reunionsHandler.js');
const msgTemplate = require('./botResponseTemplates');

msgHandler = (msg) => {
  if (msg.author.id !== process.env.SELF_ID) {
    console.log('msg.author.id', msg.author.id);
    if (msg.content.toLowerCase().includes('pong')) {
      msg.channel.send(`Ping ${Math.random() >= 0.75 ? 'biatch' : ''}`, {
        tts: true
      });
    }
    if (msg.content.toLowerCase().includes('ping')) {
      msg.channel.send(`Pong! ${Math.random() >= 0.75 ? 'biatch' : ''}`, {
        tts: true
      });
    }

    if (msg.content.toLowerCase().includes('bite') || msg.content.toLowerCase().includes('queue')) {
      msg.react("🍆");
    }

    if (msg.content.toLowerCase().startsWith('!reunion')) {
      reunion.msgHandler(msg)
        .then(e => {
          if (e && e.msgTemplateName) {
            msgTemplate[e.msgTemplateName](msg, e.payload);
          } else if (e.tutoName) {
            msg.reply(msgTemplate.tuto[e.tutoName]);
          }
        })
        .catch(e => {
          msg.reply(msgTemplate.tuto[e.tutoName]);
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