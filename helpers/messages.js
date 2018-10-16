
const reunion = require('./reunionsHandler.js');
const botMsg = require('./botResponseTemplates');

msgHandler = (msg) => {
  if (msg.author.id !== '499347187856179250') {
    console.log('msg.author.id', msg.author.id);
    if (msg.content.toLowerCase().includes('pong')) {
      msg.channel.send('Ping', {
        tts: true
      });
    }
    if (msg.content.toLowerCase().includes('ping')) {
      const biatch = Math.random() >= 0.75 ? 'biatch' : '';
      msg.channel.send(`Pong! ${biatch}`, {
        tts: true
      });
    }
  }

  if (msg.content.includes('bite') || msg.content.includes('queue')) {
    msg.react("🍆");
  }

  if (msg.content.startsWith('!reunion')) {
    reunion.msgHandler(msg);
  }

  if (msg.content.startsWith('?reunion')) {
    reunion.tuto(msg);
  }
}
module.exports = {
  msgHandler
}