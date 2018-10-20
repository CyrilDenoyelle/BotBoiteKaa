var port = process.env.PORT || 8080;
const express = require('express');
express()
  .get('/', (req, res) => { res })
  .listen(port, function () {
    console.log('Our app is running on http://localhost:' + port);
  });

const Discord = require('discord.js');
const client = new Discord.Client();
const prod = process.env.DATABASE_URL ? true : false;

// alter Date Object
// Date.prototype.addHours = (h) => this.setTime(this.getTime() + (h * 60 * 60 * 1000));
Date.prototype.addHours = (h) => console.log('this Date', this);

const { msgHandler } = require('./helpers/messages.js');
const reunion = require('./helpers/reunionsHandler.js');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}! id ${client.user.id}`);

  client.channels.get(process.env.UP_GEN).send('@here COOLCOOLCOOL');
  const intervalFunc = () => {
    const now = new Date().addHours(2)
    console.log('now', now);
    reunion[`${prod ? 'h' : 'localH'}andlers`].list(true).then(e => {
      e.payload.map(row => {
        console.log('new Date(row.date)', new Date(row.date));
        if (row && new Date(row.date) < now && !row.is_deleted) {
          console.log('yes row.is_deleted', row.is_deleted);
          reunion[`${prod ? 'h' : 'localH'}andlers`].delete(row.id);
          // client.channels.get('500978775878664195').send(`${prod ? '@veryone' : '@veryone'} c'est l'heure de ${row.name}`);
          console.log(`@everyone c'est l'heure de ${row.name}`);
        }
      })
    })
  }
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
