
const express = require('express');
const { Client } = require('discord.js');

const prod = process.env.DATABASE_URL || false;

if (!prod) require('./config.js')();

const port = process.env.PORT || 8080;
express()
  .get('/', (req, res) => { res; })
  .listen(port, () => {
    console.log(`Our app is running on http://localhost: ${port}`);
  });

// requires
const { msgHandler } = require('./helpers/messages.js');
const reunion = require('./helpers/reunionsHandler.js');
const d = require('./helpers/secondary/date.js');

// set discorde BOT client
const client = new Client();

// process.env (set environement variables)

// every 60sec in prod and 10sec in local, the bot will check if it's time for a reunion and send message to target channels and users
const intervalFunc = () => {
  const now = d.now();
  reunion[`${prod ? 'h' : 'localH'}andlers`] // if server run in prod call handlers else call localHandlers
    .list({ logs: false }).then((e) => { // call list function in selected handlsers
      e.payload.forEach((row) => { // iterate on the received list
        if (row && new Date(row.date).getTime() < now && !row.is_deleted) { // if reunion is not deleted and is passed
          reunion[`${prod ? 'h' : 'localH'}andlers`].delete(row.id); // delete reunion

          const guild = client.guilds.get(row.discord_place); // get the guild where the message have been posted
          const reunionForRole = row.role ? guild.roles.find(role => role.name === row.role) : guild.roles.find(role => role.name === '@everyone'); // get role of invited members

          guild
            .channels // get all channels in guild
            .find(chan => chan.name === 'reunions') // find reunions channel
            .send(`${reunionForRole} c'est l'heure de ${row.name}`); // send msg

          guild
            .members // get all members in guild
            .filter(member => member.roles.find(role => role === reunionForRole)) // filter all member get only member who have the role
            .forEach((member) => { // iterate on members
              if (member.user.id !== process.env.SELF_ID) { // if member is not self (self is the bot..)
                member.user.createDM() // create a direct message with the user
                  .then(dm => dm.send(`Salut ${member.user.username} c'est l'heure de ${row.name}`));
              }
            });

          console.log(`C'est l'heure de ${row.name} sur le discorde id:${row.discord_place}. now: ${new Date(now)}`);
        }
      });
    });
};

client.on('ready', () => {
  // porcess.env (get bot id for self messages detection)
  process.env.SELF_ID = client.user.id;

  console.log(`Logged in as ${client.user.tag}! id: ${process.env.SELF_ID}, au quatrième top il sera: ${d.now()}`);

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

client.on('message', (msg) => { // on message received in any channel where the bot is
  msgHandler(msg); // we pass the message to msgHandler
});

client.on('error', console.error);

client.login(process.env.TDPASS); // log the bot to discord servers with the env var process.env.TDPASS = token of the bot
