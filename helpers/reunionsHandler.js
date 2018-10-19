let reunions = [];
const pgc = require('../db/postgresClient');
const uuid = require('uuid');
const prod = process.env.DATABASE_URL ? true : false;


paramsFormaters = {
  create: (msg) => {
    const args = msg.content.split('create ')[1].split(', ');
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
  delete: (msg) => {
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
      return new Promise((res, rej) => {
        const params = paramsFormaters.create(msg);
        if (params) {
          pgc.createReunion(params)
            .then(created => {
              res({ msgTemplateName: 'createReunion', payload: created });
            });
        } else {
          rej({ tutoName: 'create' });
        }
      });
    },

    list: () => {
      return new Promise((resolve, rej) => {
        pgc.listReunion()
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
              resolve({
                msgTemplateName: 'deletedReunion',
                payload: deletedReunion
              });
            });
        } else {
          rej({ tutoName: 'delete' });
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
          rej({ tutoName: 'create' });
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
        rej({ tutoName: 'delete' });
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
