
//require
const pgc = require('../db/postgresClient');
const uuid = require('uuid');
const d = require('./secondary/date');

const isUuid = (id) => /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/.test(id);

// env vars
const prod = process.env.DATABASE_URL ? true : false;

// local vars
let reunions = [];


const paramsFormaters = {
  create: (msg) => {
    const args = msg.content.split('create ')[1].split(', ');
    if (args.length >= 2) {
      const now = d.hours(new Date(), 2);
      const argsDate = new Date(args[1]);
      const reuDate = new Date(Date.UTC(argsDate.getFullYear(), argsDate.getMonth(), argsDate.getDate(), argsDate.getHours(), argsDate.getMinutes(), argsDate.getSeconds()));

      if (new Date(reuDate).getTime() < now) return false;

      return params = {
        id: uuid(),
        name: args[0],
        date: reuDate,
        user_id: msg.author.id,
        created_at: now
      }
    } else return false;
  },
  delete: (msg) => {
    const id = msg.content && msg.content.split(' ')[2] || typeof msg === 'string' && msg; // in case we call delete function with id
    if (isUuid(id)) {
      return id;
    } else {
      return false;
    }
  }
}

const h = {
  handlers: {
    create: (msg) => {
      return new Promise((res, rej) => {
        const params = paramsFormaters.create(msg);
        if (params) {
          pgc.createReunion(params)
            .then(created => {
              res({ msgTemplateName: 'createReunion', payload: created });
            });
        } else {
          rej({ tutoName: 'createReunion' });
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
        } else {
          rej({ tutoName: 'deleteReunion' });
        }
      });
    }
  },

  localHandlers: {
    create: (msg) => {
      return new Promise((res, rej) => {
        const params = paramsFormaters.create(msg);
        if (params) {
          reunions.push(params);
          res({ msgTemplateName: 'createReunion', payload: params });
        } else {
          rej({ tutoName: 'createReunion' });
        }
      });
    },
    list: () => {
      return new Promise(() => {
        res({
          msgTemplateName: 'listReunion',
          payload: reunions
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
  } else {
    return new Promise((res, rej) => {
      res({ tutoName: 'reunion' })
    })
  }
}

module.exports = {
  msgHandler,
  handlers: h.handlers,
  localHandlers: h.localHandlers,
}
