var port = process.env.PORT || 8080;
const express = require('express');
express().get('/', (req, res) => { res })
  .listen(port, function () {
    console.log('Our app is running on http://localhost:' + port);
  });

const Discord = require('discord.js');
const { msgHandler } = require('./helpers/messages.js');
const {
  newReunion,
  cancelReunion,
  callReunion,
  getAllReunions
} = require('./helpers/reunionsHandler.js');
const client = new Discord.Client();


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // console.log(client.channels.find('name', 'général').id)
});

client.on('message', msg => {
  msgHandler(msg);
});

setInterval(() => {
  const now = new Date();
  // console.log(reunions, now);
  getAllReunions().map(e => {
    if (e && e.date < now && !e.isDeleted) {
      e.isDeleted = true;
      console.log(e);
    }
  });
}, 60000);

client.login('NDk5MzQ3MTg3ODU2MTc5MjUw.DqP-KA.kH6ZFDx1B2kvPajMELzNEK29sjE');


