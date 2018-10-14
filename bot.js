const Discord = require('discord.js');
const client = new Discord.Client();

const reunions = [];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // console.log(client.channels.find('name', 'général').id)
});

client.on('message', msg => {
  if (msg.content.includes('ping')) {
    msg.reply('');
    msg.channel.send('Pong! connard', {
      tts: true
    });
  }

  if (msg.content.includes('bite')) {
    msg.react("🍆");
  }

  if (msg.content.startsWith('!reunion ')) {
    const args = msg.content.split(' ');
    msg.reply(`reunion set au ${args[2]} pour ${args[1]}`);
    reunions.push({
      name: args[1],
      date: new Date(args[2])
    })
  }

  if (msg.content.startsWith('?reunion')) {
    msg.reply('pour utiliser la fonction de reunion votre message doit ressembler a ça biatch: "!reunion pourquoi jj/mm/aa" attention ce truk va pinguer tout le monde sur le discord. pour annuler une reunion: ');
  }

});


setInterval(() => {
  const now = new Date();
  // console.log(reunions, now);
  reunions.map(e => {
    if (e && e.date < now && !e.isDeleted) {
      e.isDeleted = true;
      console.log(e);
    }
  });
}, 30000);

client.login('NDk5MzQ3MTg3ODU2MTc5MjUw.DqP-KA.kH6ZFDx1B2kvPajMELzNEK29sjE');
