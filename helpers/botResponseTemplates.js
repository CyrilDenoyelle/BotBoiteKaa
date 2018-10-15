
const listReunion = (msg, allReunions) => {
  stres = [];
  allReunions.map(r => {
    stres.push(`${r.id} | ${r.name} | ${r.date}`);
  });
  msg.reply(` id | name | date \n ${stres.join('\n')}`);
}

module.exports = {
  listReunion
}