var port = process.env.PORT || 8080;
const express = require('express');
express()
  .get('/', (req, res) => { res })
  .listen(port, function () {
    console.log('Our app is running on http://localhost:' + port);
  });
// set discorde BOT
const Discord = require('discord.js');
const client = new Discord.Client();
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

  client.channels.get(process.env.UP_GEN).send('@here COOLCOOLCOOL');
  intervalFunc();
  setInterval(() => {
    intervalFunc();
  }, prod ? 60000 : 10000);

  if (!prod) {
    [
      '!reunion R&D 2018-10-14T17:23:00',
      '!reunion coucou 2018-10-14T17:24:00',
      '!reunion trulu 2018-10-14T17:25:00'
    ].map(e => {
      reunion.handlers.newReunionSeeds(e);
    });
  }
});

client.on('message', msg => {
  msgHandler(msg);
});


const token = process.env.TDPASS || require('./token');
client.login(token);
