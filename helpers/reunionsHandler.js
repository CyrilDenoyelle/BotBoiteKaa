
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
    const args = msg.content.slice(16).split(', ');
    if (args.length >= 2) {
      const now = d.hours(new Date(), prod ? 2 : 0);
      const date = new Date(args[1]);
      // const reuDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));

      let params = {
        id: uuid(),
        name: args[0],
        date,
        user_id: msg.author.id,
        discord_place: msg.guild.id,
        created_at: now
      }
      if (new Date(date).getTime() < now || date == "Invalid Date") {
        params.errors = [];
        if (new Date(date).getTime() < now) {
          params.errors.push('date in past');
        }
        if (date === "Invalid Date") {
          params.errors.push('Invalid Date');
        };
      }
      return params
    }
    return false;
  },
  delete: (msg) => {
    if (msg) {
      if (msg.content) {
        if (isUuid(msg.content.split(' ')[2])) {
          msg.content.split(' ')[2];
        }
      }
      else if (isUuid(msg)) {
        return msg;
      }
      return false
    }
    return false;
  }
}

const h = {
  handlers: {
    create: (msg) => {
      return new Promise((res, rej) => {
        const params = paramsFormaters.create(msg);
        if (!params.errors) {
          pgc.createReunion(params)
            .then(created => {
              res({ msgTemplateName: 'createReunion', payload: created });
            });
        } else {
          rej({ tutoName: 'createReunion', errors: params.errors });
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
        if (!params.errors) {
          reunions.push(params);
          res({ msgTemplateName: 'createReunion', payload: params });
        }
        rej({ tutoName: 'createReunion', errors: params.errors });
      });
    },
    list: () => {
      return new Promise((res, rej) => {
        res({
          msgTemplateName: 'listReunion',
          payload: reunions
        });
      });
    },
    delete: (msg) => {
      const id = paramsFormaters.delete(msg);
      return new Promise((res, rej) => {
        reunions.map((e) => {
          if (e.id === id) {
            e.is_deleted = true;
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
