
const reunion = require('./reunionsHandler.js');
const botMsg = require('./botResponseTemplates');

msgHandler = (msg) => {

  if (msg.content.includes('ping') || msg.content.includes('Ping')) {
    msg.channel.send('Pong!', {
      tts: true
    });
  }
  if (msg.content.includes('bite') || msg.content.includes('queue') || msg.content.includes('sex')) {
    msg.react("🍆");
  }

  if (msg.content.startsWith('!reunion')) {
    // reunion[msg.content.split(' ')[1]](msg);
    reunion.msgHandler(msg);
  }

  if (msg.content.startsWith('?reunion')) {
    reunion.tuto(msg);
  }
}
module.exports = {
  msgHandler
}