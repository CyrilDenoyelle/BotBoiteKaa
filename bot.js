
try {
  require('./config.js')(); // we try to execture the config.js file
} catch (e) {
  if (e instanceof Error && e.code === "MODULE_NOT_FOUND") { // if there is no config.js file we are on heroku server
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

// requires
const { msgHandler } = require('./helpers/messages.js');
const reunion = require('./helpers/reunionsHandler.js');
const d = require('./helpers/secondary/date.js');
const { Client, RichEmbed } = require('discord.js');

// set discorde BOT client
const client = new Client();

// process.env (set environement variables)
const prod = process.env.DATABASE_URL ? true : false;

// every 60sec in prod and 10sec in local, the bot will check if it's time for a reunion and send message to target channels and users
const intervalFunc = () => {
  const now = d.hours(new Date(), prod ? 2 : 0);
  reunion[`${prod ? 'h' : 'localH'}andlers`].list({ noLogs: true }).then(e => {
    e.payload.map(row => {
      if (row && new Date(row.date).getTime() < now && !row.is_deleted) {
        reunion[`${prod ? 'h' : 'localH'}andlers`].delete(row.id);

        const guild = client.guilds.get(row.discord_place) // get the guild where the message v'been posted
        guild
          .channels // get all channels in guild
          .find(e => e.name === 'reunions') // find reunions channel
          .send(`${prod ? '@everyone' : '@veryone'} c'est l'heure de ${row.name}`);

        guild
          .members // get all members in guild
          .map(member => {
            if (member.user.id !== process.env.SELF_ID) { // if member is not self (self is the bot..)
              member.user.createDM() // create a direct message with the user
                .then(dm => dm.send(`Salut ${member.user.username} c'est l'heure de ${row.name}`));
            }
          });

        console.log(`C'est l'heure de ${row.name} sur le discorde id:${row.discord_place}.`);
      }
    });
  });
}

client.on('ready', () => {
  // porcess.env (get bot id for self messages detection)
  process.env.SELF_ID = client.user.id;

  console.log(`Logged in as ${client.user.tag}! id: ${process.env.SELF_ID}`);

  client.channels.get(process.env.UP_GEN) // get channel with id = process.env.UP_GEN
    .send('UP UP UP PUTAIN') // post a message on founded channel
    .then(e => e.delete(5000)); // delete message after 5 secs
  client.users.get(process.env.ADMIN) // get user with id = process.env.ADMIN
    .createDM() // create direct message channel with the user
    .then(e => e.send('Bonjour je suis UP prèt a développer... biatche')); // then send a message to the user

  intervalFunc(); // execute the interval function (every functions we need to execute at regular interval)
  setInterval(() => {
    intervalFunc();
  }, prod ? 60 * 1000 : 10 * 1000); // if we are in prod we do it every 60sec else every 10sec

});

client.on('message', msg => { // on message received in any channel where the bot is
  msgHandler(msg); // we pass the message to msgHandler
});

client.on('error', console.error);

client.login(process.env.TDPASS); // log the bot to discord servers with the env var process.env.TDPASS = token of the bot
