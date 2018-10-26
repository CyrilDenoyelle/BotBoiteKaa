
try {
  require('./config.js')();
} catch (e) {
  if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
    console.log("I'm On Heroku Biatches");
  } else throw e;
}

const port = process.env.PORT || 8080;
const express = require('express');
express()
  .get('/', (req, res) => { res })
  .listen(port, function () {
    console.log('Our app is running on http://localhost:' + port);
  });

// set discorde BOT
const { Client, RichEmbed } = require('discord.js');
const client = new Client();
const prod = process.env.DATABASE_URL ? true : false;

// requires
const { msgHandler } = require('./helpers/messages.js');
const reunion = require('./helpers/reunionsHandler.js');
const d = require('./helpers/secondary/date.js');

// every 60sec in prod and 10sec in local, the bot will load this
const intervalFunc = () => {
  const now = d.hours(new Date(), +2);
  reunion[`${prod ? 'h' : 'localH'}andlers`].list({ noLogs: true }).then(e => {
    e.payload.map(row => {
      if (row && new Date(row.date).getTime() < now && !row.is_deleted) {
        reunion[`${prod ? 'h' : 'localH'}andlers`].delete(row.id);
        client.guilds.get(row.discord_place).channels.find('name', 'reunions').send(`${prod ? '@everyone' : '@veryone'} c'est l'heure de ${row.name}`);
        console.log(`C'est l'heure de ${row.name} sur le discorde id:${row.discord_place}.`);
      }
    });
  });
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}! id: ${client.user.id}`);

  client.channels.get(process.env.UP_GEN).send('UP UP UP PUTAIN');
  client.users.get(process.env.ADMIN).createDM().then(e => e.send('Bonjour he suis UP prèt a développer... biatche'));

  intervalFunc();
  setInterval(() => {
    intervalFunc();
  }, prod ? 60000 : 10000);

});

client.on('message', msg => {
  msgHandler(msg);
});


const token = process.env.TDPASS;
client.login(token);
