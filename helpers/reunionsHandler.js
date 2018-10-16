let reunions = [];
const pgc = require('../db/postgresClient');
const uuid = require('uuid');
const msgTutoReunion = `pour utiliser la fonction de reunion votre message doit ressembler a ça biatch: \n "!reunion pour sans guillemet 1995-12-17T13:25:00" \n (attention ce truk va faire un "@"everyone sur le discord.) \n pour annuler une reunion: c\'est tres simple aussi !reunionList affiche toute les reunion il suffi de faire un !reunionCancel ID_REUNION.`
const prod = process.env.DATABASE_URL ? true : false;


paramsFormaters = {
  create: (msg) => {
    const args = msg.split('!reunion ')[1].split(' ');
    if (args.length >= 2) {
      const now = new Date().valueOf() + 36000;
      const argsDate = new Date(args[1]);
      const reuDate = new Date(Date.UTC(argsDate.getFullYear(), argsDate.getMonth(), argsDate.getDate(), argsDate.getHours(), argsDate.getMinutes(), argsDate.getSeconds()));

      return params = {
        id: uuid(),
        name: args[0],
        date: reuDate,
        user_id: 11111111111111,
        created_at: now
      }
    } else {
      return false;
    }
  },
  cancel: (msg) => {
    const id = msg.split(' ')[2]
    if (id) {
      return id;
    }
  }
}

const handlers = {
  create: (msg) => {
    params = paramsFormaters.create();
    return params ? pgc.createReunion(params) : tuto(msg);
  },

  list: () => {
    return pgc.listReunion();
  },

  cancel: (msg) => {
    const id = paramsFormaters.cancel(msg)
    pgc.getReunionById(id).then(reunion => {
      console.log(`reunion ${id}`, reunion);
      return reunion;
    })
  }
}

localHandlers = {
  create: (msg) => {
    const params = paramsFormaters.create(msg);
    params ? reunions.push(params) : tuto(msg);
  },
  list: () => {
    return new Promise(() => {
      res(reunions);
    });
  },
  cancel: (msg) => {
    const id = msg.split(' ')[2];
    return reunions.filter({ id });
  }
}

tuto = (msg) => {
  msg.reply(msgTutoReunion);
}

msgHandler = (msg) => {
  s = msg.content.split(' ')[1];
  // [`${prod ? 'h' : 'localH'}andlers`]
  if (prod) {
    if (s && Object.keys(handlers).includes(s)) {
      handlers[s](msg);
    } else {
      tuto(msg);
    }
  } else {
    if (s && Object.keys(localHandlers).includes(s)) {
      localHandlers[s](msg);
    } else {
      tuto(msg);
    }
  }
}

module.exports = {
  msgHandler,
  handlers,
  localHandlers,
  tuto
}
