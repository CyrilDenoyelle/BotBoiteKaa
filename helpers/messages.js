
const reunion = require('./reunionsHandler.js');
const botMsg = require('./botResponseTemplates');

msgHandler = (msg) => {

  if (msg.content.includes('ping') || msg.content.includes('Ping')) {
    const biatch = Math.random() > 0.89 ? 'biatch' : '';
    msg.channel.send(`Pong! ${biatch}`, {
      tts: true
    });
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