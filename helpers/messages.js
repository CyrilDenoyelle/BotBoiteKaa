
const {
  create,
  list,
  cancel
} = require('./reunionsHandler.js');
const botMsg = require('./botResponseTemplates');
const msgTutoReunion = `pour utiliser la fonction de reunion votre message doit ressembler a ça biatch: \n "!reunion pourquoiSansEspace 1995-12-17T13:25:00" \n (attention ce truk va faire un "@"everyone sur le discord.) \n pour annuler une reunion: c\'est tres simple aussi !reunionList affiche toute les reunion il suffi de faire un !reunionCancel ID_REUNION.`

msgHandler = (msg) => {

  if (msg.content.includes('ping') || msg.content.includes('Ping')) {
    msg.channel.send('Pong!', {
      tts: true
    });
  }
  if (msg.content.includes('bite') || msg.content.includes('queue') || msg.content.includes('sex')) {
    msg.react("🍆");
  }

  // !reunion cancel ID
  // !reunion list 
  // !reunion add
  if (msg.content.startsWith('!reunion')) {
    reunion[msg.content.split(' ')[1]](msg);
  }

  if (msg.content.startsWith('!reunionList')) {
    allReunions = list(msg);
    botMsg.listReunion(msg, allReunions);
  }

  if (msg.content.startsWith('?reunion')) {
    msg.reply(msgTutoReunion);
  }
}
module.exports = {
  msgHandler
}