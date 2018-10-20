
// requires
const reunion = require('./reunionsHandler.js');
const { isWhiteListGuild } = require('./middlewares/guilds.js');
const msgTemplate = require('./botResponseTemplates');
const rand = require('./secondary/rand');

msgHandler = (msg) => {
  // IN EVERY CASES
  if (msg.content.toLowerCase().includes('bite') || msg.content.toLowerCase().includes('queue')) {
    msg.react("🍆");
  }

  // ID NOT SELF MESSAGE
  if (msg.author.id !== process.env.SELF_ID) {
    // If the message is "how to embed"
    if (msg.content.includes('how to embed')) {
      // We can create embeds using the MessageEmbed constructor
      // Read more about all that you can do with the constructor
      // over at https://discord.js.org/#/docs/main/stable/class/RichEmbed
      const embed = new RichEmbed()
        // Set the title of the field
        .setTitle('A slick little embed')
        // Set the color of the embed
        .setColor(0xFF0000)
        // Set the main content of the embed
        .setDescription('Hello, this is a slick embed!');
      // Send the embed to the same channel as the message
      msg.channel.send(embed);
    }

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

    // GUILD MIDDLEWARES
    //  || msg.author.id == process.env.ADMIN
    if (isWhiteListGuild(msg.guild.id)) {
      // REUNIONS
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
            if (e.tutoName) {
              msg.reply(msgTemplate.tutos[e.tutoName]);
            }
            setTimeout()
            console.log(`that message "${msg.content}" throwed this:`, e);
          });
      }

      // ask for reunion tuto
      if (msg.content.startsWith('?reunion')) {
        msg.reply(msgTemplate.tutos['reunion']);
      }
    }
  }
}
module.exports = {
  msgHandler
}