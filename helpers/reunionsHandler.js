
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
    const content = msg.content || msg;
    const args = content.slice(16).split(', ');
    if (args.length >= 2) {
      const now = d.hours(new Date(), prod ? 2 : 0);
      const date = new Date(args[1]);
      // const reuDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));

      let params = {
        id: uuid(),
        name: args[0],
        date,
        user_id: (msg.author && msg.author.id) || process.env.ADMIN,
        discord_place: (msg.guild && msg.guild.id) || process.env.DEFAULT_GUILD,
        created_at: now
      }
      if (new Date(date).getTime() < now || date == "Invalid Date") {
        if (new Date(date).getTime() < now) {
          params.error = 'DATE IN PAST';
        }
        else if (date == "Invalid Date") {
          params.error = 'INVALID DATE';
        };
      }
      return params;
    }
    return { error: 'NOT ENOUGH ARGUMENTS' };
  },
  list: (msg) => {// !reunion list
    if (msg.content && msg.content.length > 13) {
      const preargs = msg.content.slice(14);
      if (preargs.length > 0) {
        const args = msg.content.slice(14).split(', ');

        const withDeleted = args[0];
        const noLogs = args[1];

        return { noLogs, withDeleted };
      } else return { noLogs: true, withDeleted: false };
    } else return { noLogs: true, withDeleted: false };
  },
  delete: (msg) => {
    if (!msg) return { error: 'NO MSG' };
    if (msg.content) {
      if (isUuid(msg.content.split(' ')[2])) {
        return { id: msg.content.split(' ')[2] };
      }
      else return { error: 'MSG ID ARG IS NOT A UUID' };
    }
    else if (isUuid(msg)) return { id: msg };
    return { error: 'NO MSG CONTENT' };
  }
}

const h = {
  handlers: {
    create: (msg) => {
      return new Promise((res, rej) => {
        const params = paramsFormaters.create(msg);
        if (!params.error) {
          pgc.createReunion(params)
            .then(created => {
              res({ msgTemplateName: 'createReunion', payload: created });
            });
        } else {
          rej({ tutoName: 'createReunion', error: params.error });
        }
      });
    },

    list: (msg) => {
      return new Promise((resolve, rej) => {
        pgc.listReunion(paramsFormaters.list(msg))
          .then((e) => {
            resolve({
              msgTemplateName: 'listReunion',
              payload: e
            });
          });
      });
    },

    delete: (msg) => {
      const { id, error } = paramsFormaters.delete(msg);
      return new Promise((resolve, rej) => {
        if (!error) {
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
        } else rej({ tutoName: 'deleteReunion', error });
      });
    }
  },

  localHandlers: {
    create: (msg) => {
      return new Promise((res, rej) => {
        const params = paramsFormaters.create(msg);
        if (!params.error) {
          reunions.push(params);
          res({ msgTemplateName: 'createReunion', payload: params });
        }
        rej({ tutoName: 'createReunion', error: params.error });
      });
    },
    list: (msg) => {
      return new Promise((res, rej) => {
        const { noLogs, withDeleted } = paramsFormaters.list(msg)
        const f = e => {
          if (!withDeleted) {
            return !e.is_deleted;
          }
          return true;
        }
        res({
          msgTemplateName: 'listReunion',
          payload: reunions.filter(f)
        });
      });
    },
    delete: (msg) => {
      const { id, error } = paramsFormaters.delete(msg);
      return new Promise((res, rej) => {
        if (reunions.length > 0) {
          reunions.map((e) => {
            if (e.id === id) {
              e.is_deleted = true;
              const deletedReunion = e;
              return res({
                msgTemplateName: 'deleteReunion',
                payload: deletedReunion
              });
            }
          })
        } else {
          rej({ tutoName: 'deleteReunion', error: 'NO REUNION REGISTERED LOCALLY' });
        }
        rej({ tutoName: 'deleteReunion', error });
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
    res({ tutoName: 'reunion' });
  })
}

setTimeout(() => {
  h.localHandlers.create('!reunion create trululu1, 2030-10-27T18:00:00');
  h.localHandlers.create('!reunion create trululu2, 2030-10-27T18:00:00');
  h.localHandlers.create('!reunion create trululu3, 2030-10-27T18:00:00');
}, 2000);

module.exports = {
  msgHandler,
  handlers: h.handlers,
  localHandlers: h.localHandlers,
}
