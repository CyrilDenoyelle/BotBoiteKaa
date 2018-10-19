let reunions = [];
const pgc = require('../db/postgresClient');
const uuid = require('uuid');
const prod = process.env.DATABASE_URL ? true : false;


paramsFormaters = {
  create: (msg) => {
    const args = msg.content.split('!reunion ')[1].split(' ');
    if (args.length >= 2) {
      const now = new Date().valueOf() + 36000;
      const argsDate = new Date(args[1]);
      const reuDate = new Date(Date.UTC(argsDate.getFullYear(), argsDate.getMonth(), argsDate.getDate(), argsDate.getHours(), argsDate.getMinutes(), argsDate.getSeconds()));

      return params = {
        id: uuid(),
        name: args[0],
        date: reuDate,
        user_id: 11111111111111,
        created_at: now
      }
    } else {
      return false;
    }
  },
  cancel: (msg) => {
    const id = msg.content.split(' ')[2];
    if (/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/.test(id)) {
      return id;
    } else {
      return false;
    }
  }
}

const h = {
  handlers: {
    create: (msg) => {
      return Promise((res, rej) => {
        const params = paramsFormaters.create(msg);
        if (params) {
          pgc.createReunion(params).then(created => {
            res({ msgTemplateName: 'createReunion', payload: created });
          })
        } else {
          rej({ tutoName: 'create' });
        }
      })
    },

    list: () => {
      return Promise((resolve, rej) => {
        pgc.listReunion()
          .then((e) => {
            resolve({
              msgTemplateName: 'listReunion',
              payload: e
            });
          });
      });
    },

    cancel: (msg) => {
      const id = paramsFormaters.cancel(msg);
      return new Promise((resolve, rej) => {
        if (id) {
          pgc.getReunionById(id)
            .then(canceledReunion => {
              resolve({
                msgTemplateName: 'cancelReunion',
                payload: canceledReunion
              });
            });
        } else {
          rej('cancel');
        }
      });
    }
  },

  localHandlers: {
    create: (msg) => {
      return Promise((res, rej) => {
        const params = paramsFormaters.create(msg);
        if (params) {
          reunions.push(params);
          res({ msgTemplateName: 'createReunion', payload: params });
        } else {
          rej('create');
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
    cancel: (msg) => {
      const id = msg.split(' ')[2];
      return new Promise((res, rej) => {
        reunions.map((e) => {
          if (e.id === id) {
            e.isDeleted = true;
            canceledReunion = e;
            return res({
              msgTemplateName: 'cancelReunion',
              payload: canceledReunion
            });
          }
        });
        rej('cancel');
      });
    }
  }
}

msgHandler = (msg) => {
  const s = msg.content.split(' ')[1];
  const p = `${prod ? 'h' : 'localH'}andlers`;
  // p is for use h.handlers in prod and h.localHandlers in local
  if (s && Object.keys(h[p]).includes(s)) {
    return h[p][s](msg);
  } else {
    tuto(msg);
  }
}

module.exports = {
  msgHandler,
  handlers: h.handlers,
  localHandlers: h.localHandlers,
  tuto
}
