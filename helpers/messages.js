

msgHandler = (msg) => {

  if (msg.content.includes('ping')) {
    msg.reply('');
    msg.channel.send('Pong!', {
      tts: true
    });
  }

  if (msg.content.includes('bite')) {
    msg.react("🍆");
  }

  if (msg.content.startsWith('!reunion ')) {
    const args = msg.content.split(' ');
    if (args.length >= 3) {

      msg.reply(`reunion set au ${args[2]} pour ${args[1]}`);
      msg.channel.send('!');
      reunions.push({
        name: args[1],
        date: new Date(args[2])
      })
    } else {
      msg.reply();

    }
  }

  if (msg.content.startsWith('?reunion')) {
    msg.reply('pour utiliser la fonction de reunion votre message doit ressembler a ça biatch: "!reunion pourquoi jj/mm/aa" attention ce truk va pinguer tout le monde sur le discord. pour annuler une reunion: ');
  }
}
module.exports = {
  msgHandler
}