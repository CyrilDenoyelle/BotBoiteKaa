let reunions = [];
const { reunionAddPg } = require('../db/postgresClient');


newReunion = (msg) => {
  const args = msg.content.split('!reunion ')[1].split(' ');
  console.log('args ', args);
  if (args.length >= 2) {
    msg.reply(`reunion set au ${args[1]} pour ${args[0]}`);

    const now = new Date().valueOf() + 36000;
    const argsDate = new Date(args[1]);
    reuDate = new Date(Date.UTC(argsDate.getFullYear(), argsDate.getMonth(), argsDate.getDate(), argsDate.getHours(), argsDate.getMinutes(), argsDate.getSeconds()));

    msg.channel.send(reuDate);
    const params = {
      name: args[0],
      date: reuDate,
      user_id: msg.author.id,
      created_at: now
    }

    // console.log('process.env.DATABASE_URL ', process.env.DATABASE_URL);
    if (process.env.DATABASE_URL) {
      reunionAddPg(params).catch(e => console.log('error', e));
    } else {
      reunions.push(params);
      console.log(reunions);
    }
  } else {
    msg.reply(msgTutoReunion);
  }
}

cancelReunion = (r) => {
  reunions.index(r);
}

callReunion = (r) => {
  console.log(r);
}

getAllReunions = () => {
  return reunions;
}

module.exports = {
  newReunion,
  cancelReunion,
  callReunion,
  getAllReunions
}