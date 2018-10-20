
const listReunion = (msg, allReunions) => {
  list = [];
  allReunions.map(r => {
    list.push(`${r.id} | ${r.name} | ${r.date}`);
  });
  msg.reply(`\n id | name | date \n ${list.join('\n')}`);
}

const createReunion = (msg, created) => {
  msg.reply(`c'est vous l'doc doc: \n id | name | date \n ${created.id} | ${created.name} | ${created.date}`);
}

const deleteReunion = (msg, created) => {
  msg.reply(`c'est vous l'doc doc: \n id | name | date \n ${created.id} | ${created.name} | ${created.date}`);
}

const tutos = {
  createReunion: `pour creer une reunion votre message doit ressembler a ça biatch: \n "!reunion create pourquoi sans apostrophe, 1995-12-17T13:25:00" \n (attention ce truk va faire un "@"everyone sur le discord a l'heure donnée.)`,
  deleteReunion: `pour annuler une reunion: "!reunion delete ID_REUNION." (!reunion list affiche toutes les reunions)`,
  listReunion: `!reunion list affiche toutes les reunions`,
  reunion: `pour utiliser la fonction de reunion votre message doit ressembler a ça biatch: \n "!reunion create pourquoi sans apostrophe, 1995-12-17T13:25:00" \n (attention ce truk va faire un "@"everyone sur le discord.) \n pour annuler une reunion: c\'est tres simple aussi "!reunion list" affiche toute les reunions il suffit de faire un "!reunion delete ID_REUNION".`,
  helpReunion: `azerjkqsldfkxcvnorutapiurqkdjwbcxbkhfdgaurieysqgojfsnbmsfh`
}

module.exports = {
  listReunion,
  createReunion,
  deleteReunion,
  tutos
}