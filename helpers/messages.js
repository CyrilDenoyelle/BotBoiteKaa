
const reunion = require('./reunionsHandler.js');
const botMsg = require('./botResponseTemplates');
const msgTutoReunion = 'pour utiliser la fonction de reunion votre message doit ressembler a ça biatch: "!reunion pourquoiSansEspace 1995-12-17T13:25:00" attention ce truk va faire un "@"chanel sur le discord. pour annuler une reunion: c\'est tres simple aussi !reunionList affiche toute les reunion il suffi de faire un !cancelReunion ID_REUNION.'
const msgListingReunion = ''

msgHandler = (msg) => {

  if (msg.content.includes('ping')) {
    msg.channel.send('Pong!', {
      tts: true
    });
  }
  if (msg.content.includes('bite')) {
    msg.react("🍆");
  }

  if (msg.content.startsWith('!reunion ')) {
    reunion.newReunion(msg);
  }
  if (msg.content.startsWith('!reunionList ')) {
    allReunions = reunion.getAllReunions(msg);
    botMsg.reunionList(msg, allReunions);
  }

  if (msg.content.startsWith('?reunion')) {
    msg.reply(msgTutoReunion);
  }
}
module.exports = {
  msgHandler
}