let reunions = [];
const pgc = require('../db/postgresClient');
const uuid = require('uuid');

"reunion create quelquechose de bien, demain"
const create = (msg) => {
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
}

const newReunionSeeds = (msg) => {
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
}
const cancel = (msg) => {
  const id = msg.split(' ')[2];
  pgc.getReunionById(id).then(reunion => {
    console.log(`reunion ${id}`, reunion);
    return reunion;
  })
}

const callReunion = (r) => {
  console.log(r);
}

const list = () => {
  if (process.env.DATABASE_URL) {
    return pgc.listReunion();
  } else {
    return reunions;
  }
}

module.exports = {
  create,
  cancel,
  callReunion,
  newReunionSeeds,
  list
}