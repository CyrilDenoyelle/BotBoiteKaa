let reunions = [];
const {
  createReunion,
  listReunion,
  getReunionById
} = require('../db/postgresClient');
const uuid = require('uuid');

newReunion = (msg) => {
  const args = msg.content.split('!reunion ')[1].split(' ');
  console.log('args ', args);
  if (args.length >= 2) {
    msg.reply(`reunion set au ${args[1]} pour ${args[0]}`);

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
      createReunion(params);
    } else {
      reunions.push(params);
      console.log('reunions', reunions);
    }
  } else {
    msg.reply(msgTutoReunion);
  }
}

newReunionSeeds = (msg) => {
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

cancelReunion = (r) => {
  getReunionById(r.id).then(reunion => {
    console.log(`reunion ${r.id}`, reunion);
  })
}

callReunion = (r) => {
  console.log(r);
}

getAllReunions = () => {
  if (process.env.DATABASE_URL) {
    return listReunion();
  } else {
    return reunions;
  }
}

module.exports = {
  newReunion,
  cancelReunion,
  callReunion,
  newReunionSeeds,
  getAllReunions
}