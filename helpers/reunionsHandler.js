
// require
const uuid = require('uuid');

const d = require('./secondary/date');
const pgc = require('../db/postgresClient');

const isUuid = id => /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/.test(id);

// env vars
const prod = process.env.DATABASE_URL || false;

// local vars
const reunions = [];
const possibleFilter = ['all', 'deleted', 'everywhere'];

const whereFilterSql = (filters) => {
  const filtersKeys = Object.keys(filters);

  const str = filtersKeys.reduce((result, filter) => {
    result.push(` ${filter} = ${filters[filter]}`);
    return result;
  }, []).join(' AND');

  return ` WHERE${str}`;
};

const objFiltersToSqlFilters = (filters, guildId) => {
  const sqlStrTabl = [];
  if (Object.keys(filters).filter(key => possibleFilter.includes(key)).length > 0) {
    if (!filters.everywhere && guildId) {
      sqlStrTabl.push(` discord_place = '${guildId}'`);
    }
    if (!filters.all) {
      if (filters.deleted) {
        sqlStrTabl.push(' is_deleted IS TRUE');
      } else {
        sqlStrTabl.push(' (is_deleted IS NULL OR is_deleted IS FALSE)');
      }
    }
  }
  if (sqlStrTabl.length > 0) return ` WHERE${sqlStrTabl.join(' AND')}`;
  return '';
};


const paramsFormaters = {
  create: (msg) => {
    const content = msg.content || msg;
    const args = content.slice(16).split(', ');
    if (args.length >= 2) {
      const now = d.now();
      const date = new Date(args[1]);
      // const reuDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));

      const params = {
        id: uuid(),
        name: args[0],
        role: args[2],
        date,
        user_id: (msg.author && msg.author.id) || process.env.ADMIN,
        discord_place: (msg.guild && msg.guild.id) || process.env.DEFAULT_GUILD,
        created_at: now
      };

      if (new Date(date).getTime() < now || date === 'Invalid Date') {
        if (new Date(date).getTime() < now) {
          params.error = 'DATE IN PAST';
        } else if (date === 'Invalid Date') {
          params.error = 'INVALID DATE';
        }
      }
      return params;
    }
    return { error: 'NOT ENOUGH ARGUMENTS' };
  },
  list: (msg) => { // !reunion list all deleted everywhere logs
    if (msg && msg.content && msg.content.length > 13) {
      const preargs = msg.content.slice(14);
      const args = preargs.split(' ');
      const filters = {};
      let logs = false;

      args.forEach((arg) => {
        if (possibleFilter.includes(arg)) filters[arg] = true;
        if (arg === 'logs') logs = true;
      });

      const payload = { guild: msg.guild.id, filters, logs };

      console.log(payload);
      return payload;
    }
    if (msg && msg.filters && msg.guild) return msg;
    return { guild: msg && msg.guild && msg.guild.id, logs: false, filters: { deleted: false, here: false } };
  },
  delete: (msg) => {
    if (!msg) return { error: 'NO MSG' };
    if (msg.content) {
      if (isUuid(msg.content.split(' ')[2])) {
        return { id: msg.content.split(' ')[2] };
      }
      return { error: 'MSG ID ARG IS NOT A UUID' };
    }
    if (isUuid(msg)) return { id: msg };

    return { error: 'NO MSG CONTENT' };
  }
};

const h = {
  handlers: {
    create: msg => new Promise((res, rej) => {
      const params = paramsFormaters.create(msg);
      if (!params.error) {
        pgc.createReunion(params)
          .then((created) => {
            res({ msgTemplateName: 'createReunion', payload: created });
          });
      } else {
        rej({ tutoName: 'createReunion', error: params.error });
      }
    }),
    list: msg => new Promise((resolve) => {
      const { filters, logs } = paramsFormaters.list(msg);
      const sqlFilters = objFiltersToSqlFilters(filters, msg && msg.guild && msg.guild.id);
      pgc.listReunion({ sqlFilters, logs })
        .then((e) => {
          resolve({
            msgTemplateName: 'listReunion',
            payload: e
          });
        });
    }),

    delete: (msg) => {
      const { id, error } = paramsFormaters.delete(msg);
      return new Promise((resolve, rej) => {
        if (!error) {
          pgc.getReunionById(id)
            .then((deletedReunion) => {
              deletedReunion.is_deleted = true;
              pgc.updateReunion(id, { is_deleted: true })
                .then(() => {
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
    create: msg => new Promise((res, rej) => {
      const params = paramsFormaters.create(msg);
      if (!params.error) {
        reunions.push(params);
        res({ msgTemplateName: 'createReunion', payload: params });
      }
      rej({ tutoName: 'createReunion', error: params.error });
    }),
    list: msg => new Promise((res) => {

      const { filters, guild, logs } = paramsFormaters.list(msg);

      const f = (e) => {
        // ['all', 'deleted', 'everywhere', 'logs'];
        if (!filters.everywhere && guild !== e.discord_place) {
          return false;
        }
        if (filters.all) {
          return true;
        }
        if (filters.deleted) {
          return e.is_deleted;
        }
        return !e.is_deleted;
      };

      const filtered = reunions.filter(f);
      if (logs) console.log({ filters, guild });
      res({
        msgTemplateName: 'listReunion',
        payload: filtered
      });
    }),
    delete: (msg) => {
      const { id, error } = paramsFormaters.delete(msg);
      return new Promise((res, rej) => {
        if (reunions.length > 0) {
          const filteredReunions = reunions.filter((reunion) => {
            if (reunion.id === id) {
              reunion.is_deleted = true;
              return true;
            }
          });
          if (filteredReunions.length > 0) {
            return res({
              msgTemplateName: 'deleteReunion',
              payload: filteredReunions[0]
            });
          }
          return rej({ tutoName: 'deleteReunion', error: 'NO REUNION FOUND' });
        }
        return rej({ tutoName: 'deleteReunion', error });
      });
    }
  }
};

const msgHandler = (msg) => {
  const s = msg.content.split(' ')[1];
  // s is the function user want to call
  const p = `${prod ? 'h' : 'localH'}andlers`;
  // p is for use h.handlers in prod and h.localHandlers in local
  if (s && Object.keys(h[p]).includes(s)) {
    // here we call the env where we are and so the function we need
    return h[p][s](msg);
  }
  return new Promise((res) => {
    res({ tutoName: 'reunion' });
  });
};

setTimeout(() => {
  h.localHandlers.create('!reunion create trululu1, 2030-10-27T18:00:00');
  h.localHandlers.create('!reunion create trululu2, 2030-10-27T18:00:00, admin');
  h.localHandlers.create('!reunion create trululu3, 2030-10-27T18:00:00, dev');
}, 2000);

module.exports = {
  msgHandler,
  handlers: h.handlers,
  localHandlers: h.localHandlers,
};
