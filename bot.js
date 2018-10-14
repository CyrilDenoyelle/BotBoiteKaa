var port = process.env.PORT || 8080;
const express = require('express');
express().get('/', (req, res) => { res })
  .listen(port, function () {
    console.log('Our app is running on http://localhost:' + port);
  });


const Discord = require('discord.js');
const client = new Discord.Client();

const { msgHandler } = require('./helpers/messages.js');
const {
  newReunionSeeds,
  getAllReunions
} = require('./helpers/reunionsHandler.js');

const {
  reunionList,
} = require('./db/postgresClient.js');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // console.log(client.channels.find('name', 'général').id)
});

client.on('message', msg => {
  msgHandler(msg);
});


[
  '!reunion R&D 2018-10-14T17:23:00',
  '!reunion coucou 2018-10-14T17:24:00',
  '!reunion trulu 2018-10-14T17:25:00'
].map(e => {
  newReunionSeeds(e);
})

setInterval(() => {
  const now = new Date();
  // console.log('getAllReunions', getAllReunions());
  reunionList().then(e => {
    e.map(row => {
      console.log('reunion list then map row', row);
      if (row && row.date > now && !row.isDeleted) {
        // e.isDeleted = true;

        // if (process.env.DATABASE_URL) {
        //   client.channels.get('500978775878664195').send(`${process.env.DATABASE_URL ? '@veryone' : '@veryone'} c'est l'heure de ${e.name}`);
        // } else {
        // }
        console.log(`@everyone c'est l'heure de ${row.name}`);
      }
    })
  })
}, process.env.DATABASE_URL ? 60000 : 10000);

client.login('NDk5MzQ3MTg3ODU2MTc5MjUw.DqP-KA.kH6ZFDx1B2kvPajMELzNEK29sjE');


