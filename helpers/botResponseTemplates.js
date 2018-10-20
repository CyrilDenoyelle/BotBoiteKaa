
const listReunion = (msg, allReunions) => {
  list = [];
  allReunions.map(r => {
    list.push(`${r.id} | ${r.name} | ${r.date}`);
  });
  msg.reply(`\n id | name | date \n ${list.join('\n')}`);
}

const createReunion = (msg, created) => {
  msg.reply(`c'est vous l'doc doc: réunion créée \n ${created.id} | ${created.name} | ${created.date}`);
}

const deleteReunion = (msg, deleted) => {
  msg.reply(`c'est vous l'doc doc: réunion supprimée \n ${deleted.name} | ${deleted.date}`);
}

const tutos = {
  createReunion: `pour créer une réunion votre message doit ressembler a ça les biatches: \n"!reunion create pourquoi sans apostrophe, AAAA-MM-JJTHH:mm:ss" ça marche pas si la date est pas dans l'turfu. \n(attention ce truk va faire un "@"everyone sur le discord a l'heure donnée.)`,
  deleteReunion: `pour annuler une réunion: "!reunion delete ID_REUNION." ("!reunion list" affiche toutes les réunions)`,
  listReunion: `"!reunion list" affiche toutes les réunions`,
  reunion: `pour utiliser les fonctions de réunion votre message doit ressembler a ça les biatches: \n"!reunion create pourquoi sans apostrophe, AAAA-MM-JJTHH:mm:ss" \npour annuler une reunion: c'est tres simple aussi "!reunion list" affiche toute les réunions il suffit alors de faire un "!reunion delete ID_REUNION".`,
  helpReunion: `azerjkqsldfkxcvnorutapiurqkdjwbcxbkhfdgaurieysqgojfsnbmsfh`
}

module.exports = {
  listReunion,
  createReunion,
  deleteReunion,
  tutos
}