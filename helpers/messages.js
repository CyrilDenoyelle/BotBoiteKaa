
const reunion = require('./reunionsHandler.js');

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
      reunion.msgHandler(msg).then(e => {
        console.log('msgHandler promise', e);
      });
    }

    if (msg.content.startsWith('?reunion')) {
      reunion.tuto(msg);
    }
  }
}
module.exports = {
  msgHandler
}