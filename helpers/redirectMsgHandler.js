
//require
const pgc = require('../db/postgresClient');
const uuid = require('uuid');
const d = require('./secondary/date');

const isUuid = (id) => /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/.test(id);

// env vars
const prod = process.env.DATABASE_URL ? true : false;

// local vars
let redirectMsg = [];

const paramsFormaters = {
  create: (msg) => {
    console.log('msg.content', msg.content);
    const preargs = msg.content.slice(17);
    console.log('preargs', preargs);
    let args;
    if (preargs && preargs === ' ') {
      args = preargs[1].split(', ');
    } else {
      return false;
    }

    if (args.length >= 3) {
      const now = d.hours(new Date(), 2);
      const date = new Date(args[1]);
      // const reuDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
      const triggeringWord = args[0];
      const baseChannelId = args[1];
      const targetChannelId = args[2];

      const authorId = msg.author ? msg.author.id : !prod ? 23456789098765 : false;

      if (baseChannelId === targetChannelId || !authorId) return false;

      // triggering_word
      // from_name
      // user_id
      // created_at
      return params = {
        id: uuid(),
        triggering_word: triggeringWord,
        from_id: baseChannelId,
        to_id: targetChannelId,
        user_id: authorId,
        created_at: now
      }
    }
    return false;
  },
  delete: (msg) => {
    const id = msg.content && msg.content.split(' ')[2] || typeof msg === 'string' && msg; // in case we call delete function with id
    if (isUuid(id)) {
      return id;
    }
    return false;
  }
}

const h = {
  handlers: {
    create: (msg) => {
      return new Promise((res, rej) => {
        const params = paramsFormaters.create(msg);
        if (params) {
          pgc.createRedirect(params)
            .then(created => {
              res({ msgTemplateName: 'createRedirect', payload: created });
            });
        } else {
          rej({ tutoName: 'createRedirect' })
        }
      });
    },

    list: (nologs) => {
      return new Promise((resolve, rej) => {
        pgc.listReunion(nologs)
          .then((e) => {
            resolve({
              msgTemplateName: 'listReunion',
              payload: e
            });
          });
      });
    },

    delete: (msg) => {
      const id = paramsFormaters.delete(msg);
      return new Promise((resolve, rej) => {
        if (id) {
          pgc.getReunionById(id)
            .then(deletedReunion => {
              deletedReunion.is_deleted = true;
              pgc.updateReunion(id, { is_deleted: true }).then((e) => {
                resolve({
                  msgTemplateName: 'deleteReunion',
                  payload: deletedReunion
                });
              });
            });
        }
        rej({ tutoName: 'deleteReunion' });
      });
    }
  },

  localHandlers: {
    create: (msg) => {
      return new Promise((res, rej) => {
        const params = paramsFormaters.create(msg);
        if (params) {
          redirectMsg.push(params);
          res({ msgTemplateName: 'createRedirect', payload: params });
        }
        rej({ tutoName: 'createRedirect' });
        console.log('createMsg', redirectMsg);
      });
    },
    list: () => {
      return new Promise((res, rej) => {
        res({
          payload: redirectMsg
        });
      });
    },
    delete: (msg) => {
      const id = msg.split(' ')[2];
      return new Promise((res, rej) => {
        reunions.map((e) => {
          if (e.id === id) {
            e.isDeleted = true;
            deletedReunion = e;
            return res({
              msgTemplateName: 'deleteReunion',
              payload: deletedReunion
            });
          }
        });
        rej({ tutoName: 'deleteReunion' });
      });
    }
  }
}

msgHandler = (msg) => {
  const s = msg.content.split(' ')[1];
  // s is the function user want to call
  const p = `${prod ? 'h' : 'localH'}andlers`;
  // p is for use h.handlers in prod and h.localHandlers in local
  if (s && Object.keys(h[p]).includes(s)) {
    // here we call the env where we are and so the function we need
    return h[p][s](msg);
  }
  return new Promise((res, rej) => {
    res({ tutoName: 'reunion' })
  })
}

module.exports = {
  msgHandler,
  handlers: h.handlers,
  localHandlers: h.localHandlers,
}
