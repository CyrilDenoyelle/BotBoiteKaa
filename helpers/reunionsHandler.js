let reunions = [];
const pgc = require('../db/postgresClient');
const msgTutoReunion = `pour utiliser la fonction de reunion votre message doit ressembler a ça biatch: \n "!reunion pourquoiSansEspace 1995-12-17T13:25:00" \n (attention ce truk va faire un "@"everyone sur le discord.) \n pour annuler une reunion: c\'est tres simple aussi !reunionList affiche toute les reunion il suffi de faire un !reunionCancel ID_REUNION.`

const handlers = {

  create: (msg) => {
    const args = msg.content.split(' ').slice(2).join(' ').split(', ');
    console.log('args ', args);
    if (args.length >= 2) {
      msg.reply(`reunion set au ${args[0]} pour ${args[1]}`);

      const now = new Date().valueOf() + 36000;
      const argsDate = new Date(args[1]);
      reuDate = new Date(Date.UTC(argsDate.getFullYear(), argsDate.getMonth(), argsDate.getDate(), argsDate.getHours(), argsDate.getMinutes(), argsDate.getSeconds()));

      const params = {
        id: uuid(),
        name: args[0],
        date: reuDate,
        user_id: msg.author.id,
        created_at: now
      }

      if (process.env.DATABASE_URL) {
        pgc.createReunion(params);
      } else {
        reunions.push(params);
        console.log('reunions', reunions);
      }
    } else {
      msg.reply(msgTutoReunion);
    }
  },

  newReunionSeeds: (msg) => {
    const args = msg.split('!reunion ')[1].split(' ');
    console.log('args ', args);
    if (args.length >= 2) {
      const now = new Date().valueOf() + 36000;
      const argsDate = new Date(args[1]);
      reuDate = new Date(Date.UTC(argsDate.getFullYear(), argsDate.getMonth(), argsDate.getDate(), argsDate.getHours(), argsDate.getMinutes(), argsDate.getSeconds()));

      const params = {
        id: uuid(),
        name: args[0],
        date: reuDate,
        user_id: 11111111111111,
        created_at: now
      }
      reunions.push(params);
    }
  },

  cancel: (msg) => {
    const id = msg.split(' ')[2];
    pgc.getReunionById(id).then(reunion => {
      console.log(`reunion ${id}`, reunion);
      return reunion;
    })
  },

  callReunion: (r) => {
    console.log(r);
  },

  list: () => {
    if (process.env.DATABASE_URL) {
      return pgc.listReunion();
    } else {
      return reunions;
    }
  }

}

tuto = (msg) => {
  msg.reply(msgTutoReunion);
}

msgHandler = (msg) => {
  s = msg.content.split(' ')[1];

  if (s && Object.keys(handlers).includes(s)) {
    handlers[s](msg);
  } else {
    tuto(msg);
  }
}

module.exports = {
  msgHandler,
  handlers,
  tuto
}
