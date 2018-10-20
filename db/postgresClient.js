const { Client } = require('pg');
const client = () => new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const generalFormater = (params) => {
  arr = [];
  Object.keys(params).map(paramName => { arr.push(`${paramName} = '${params[paramName]}'`) });
  return arr.join(', ');
}

const createSqlFormater = (params) => {
  return `(${Object.keys(params).join(', ')}) VALUES ('${Object.values(params).join('\', \'')}')`;
}

const createReunion = (params) => {
  return new Promise((resolve, rej) => {
    tempClient = client();
    tempClient.connect();
    console.log(`SQL CREATEREUNION => INSERT INTO reunion ${createSqlFormater(params)}`);
    tempClient.query(`INSERT INTO reunion ${createSqlFormater(params)}`, (err, res) => {
      if (err) {
        console.log('error sql', err);
        return rej({ tutoName: 'createReunion', err })
      };
      resolve(params);
      tempClient.end();
    });
    // rej({ tutoName: 'createReunion', err: 'no sql response' });
  });
};

const listReunion = ({ noLogs }) => {
  return new Promise((resolve, rej) => {
    tempClient = client();
    tempClient.connect();
    if (!noLogs) console.log(`SQL LISTREUNION => SELECT * FROM reunion;`);
    tempClient.query(`SELECT * FROM reunion;`, (err, res) => {
      if (err) {
        console.log('error', err);
        return null;
      }
      resolve(res.rows);
      tempClient.end();
    });
  });
};

const getReunionById = (id) => {
  return new Promise((resolve, rej) => {
    tempClient = client();
    tempClient.connect();
    console.log(`SQL GETREUNIONBYID => SELECT * FROM reunion where id = '${id}' ;`);
    tempClient.query(`SELECT * FROM reunion where id = '${id}' ;`, (err, res) => {
      if (err) {
        console.log('error', err);
        return null;
      }
      resolve(res.rows[0]);
      tempClient.end();
    });
  });
};

const updateReunion = (id, params) => {
  return new Promise((resolve, rej) => {
    tempClient = client();
    tempClient.connect();
    console.log(`SQL UPDATEREUNION => UPDATE reunion SET ${generalFormater(params)} WHERE id = '${id}'`);
    tempClient.query(`UPDATE reunion SET ${generalFormater(params)} WHERE id = '${id}'`, (err, res) => {
      if (err) {
        console.log('error', err);
        return null;
      }
      resolve(res.rows[0]);
      tempClient.end();
    });
  });
};

module.exports = {
  createReunion,
  listReunion,
  getReunionById,
  updateReunion
}
