
// requires
const reunion = require('./reunionsHandler.js');
const redirectMsg = require('./redirectMsgHandler.js');
const { isWhiteListGuild } = require('./middlewares/guilds.js');
const msgTemplate = require('./botResponseTemplates');
const rand = require('./secondary/rand');
const dico = require('./secondary/dico');
const { reply: recastReply, talk } = require('./recastai/recastaiClient.js');
const { includesOneOf, startsWithOneOf } = require('./secondary/oneOf.js');

let allRedirectsMsg;
redirectMsg.msgHandler({ content: '!redirect list' })
  .then(e => {
    allRedirectsMsg = e.payload
  })

msgHandler = (msg, client) => {
  // IN EVERY CASES
  // if (msg.content.toLowerCase().includes('bite') || msg.content.toLowerCase().includes('queue')) {
  if (includesOneOf(msg.content, ['bite', 'queue', 'zizi', 'prepu', 'organe genital', 'pine', 'kiki'])) {
    msg.react("🍆").catch(e => console.log('msg.react(eggplant) throwed: ', e));
  }

  // IF NOT SELF MESSAGE
  if (msg.author.id !== process.env.SELF_ID) {

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

    if (msg.channel.id === '483313350344835074' && msg.content.includes('https')) {
      let urls = [];
      msg.content.split(' ')
        .map(el => {
          el.includes('https') ? urls.push(el) : null;
        })
      client.channels.get('501763051075141635').send(`${msg.author.username} posted ${urls.join(' ')}`);
    }

    if (msg.content.includes('!redirect')) {
      redirectMsg.msgHandler(msg)
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
          // setTimeout();
          console.log(`that message "${msg.content}" throwed this:`, e);
        });
    }
    const filteredRedirect = allRedirectsMsg.filter(e => e.from_id == msg.channel.id && msg.content.includes(e.triggering_word))
    if (filteredRedirect.length > 0) {
      filteredRedirect.map(redirect => {
        client.channels.get(redirect.to_id).send(`${msg.author.username} posted ${msg.content}`);
      })
    }

    // GUILD MIDDLEWARES
    //  || msg.author.id == process.env.ADMIN
    if (msg.guild && isWhiteListGuild(msg.guild.id)) {
      // REUNIONS
      if (startsWithOneOf(msg.content, ['!reunion', '!réunion'])) {
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
            // setTimeout();
            console.log(`that message "${msg.content}" throwed this:`, e);
          });
      }

      // ask for reunion tuto
      if (msg.content.startsWith('?reunion')) {
        msg.reply(msgTemplate.tutos['reunion']);
      }
    }

    if (msg.guild === null) { // PM
      if (msg.content.includes('kamoulox')) {
        msg.reply(rand.onArray(dico()));
      } else if (msg.content && msg.content.length > 0) {
        // talk(msg.content)
        //   .then((res) => {
        //     console.log(res.raw);
        //   });
        // recastReply({
        //   type: "message",
        //   value: {
        //     type: "text",
        //     content: msg.content
        //   }
        // }).then(res => {
        //   console.log('res recastai', res);
        // })
      }
    }
  }
}
module.exports = {
  msgHandler
}