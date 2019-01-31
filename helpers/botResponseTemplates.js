
const listReunion = (msg, allReunions) => {
  const list = [];
  allReunions.forEach((r) => {
    list.push(`${r.id} | ${r.name} | ${r.date}`);
  });
  const r = list.length > 0 ? `\n id | name | date \n ${list.join('\n')}` : 'pas de réunion ici.';
  return msg.reply(r);
};

const createReunion = (msg, created) => msg.reply(`c'est vous l'doc doc: réunion créée \n ${created.id} | ${created.name} | ${created.date}`);

const deleteReunion = (msg, deleted) => msg.reply(`c'est vous l'doc doc: réunion supprimée \n ${deleted.name} | ${deleted.date}`);

const citationTemplate = ({ body }) => {
  const { citation: { infos: { personnage, saison, episode } } } = body;
  const citation = body.citation.citation.startsWith(' ') ? body.citation.citation.slice(1) : body.citation.citation;
  return `"${citation && citation.trim()}" ${personnage && personnage.trim()}, ${saison && saison.trim()}, episode ${episode && episode.trim()}`;
};

const quizzTemplateQuestion = {
  saison: ({ citation }) => `Dans quelle livre est cette citation ? "${citation}"`,
  personnage: ({ citation }) => `Quel personnage dis cette citation ? "${citation}"`,
};

const tutos = {
  createReunion: `pour créer une réunion votre message doit ressembler a ça les biatches: \n"!reunion create pourquoi sans apostrophe, AAAA-MM-JJTHH:mm:ss". \n(attention ce truk va faire un "@"everyone sur le discord a l'heure donnée.)`,
  deleteReunion: `pour annuler une réunion: "!reunion delete ID_REUNION." ("!reunion list" affiche les réunions)`,
  listReunion: `"!reunion list" affiche les réunions avenir, ajouter "true" pour afficher toute les réunions`,
  reunion: `pour utiliser les fonctions de réunion votre message doit ressembler a ça les biatches: \n"!reunion create pourquoi sans apostrophe, AAAA-MM-JJTHH:mm:ss" \npour annuler une reunion: c'est tres simple aussi "!reunion list" affiche toute les réunions il suffit alors de faire un "!reunion delete ID_REUNION".`,
  helpReunion: `azerjkqsldfkxcvnorutapiurqkdjwbcxbkhfdgaurieysqgojfsnbmsfh`
};

module.exports = {
  listReunion,
  createReunion,
  deleteReunion,
  citationTemplate,
  tutos,
  quizzTemplateQuestion
}
