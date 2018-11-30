
const { Client } = require('pg');

const client = () => new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const generalFormater = (params) => {
  const arr = [];
  Object.keys(params).forEach((paramName) => { arr.push(`${paramName} = '${params[paramName]}'`); });
  return arr.join(', ');
};

const createSqlFormater = params => `(${Object.keys(params).join(', ')}) VALUES ('${Object.values(params).join('\', \'')}')`;

const createReunion = params => new Promise((resolve, rej) => {
  const tempClient = client();
  tempClient.connect();
  console.log(`SQL CREATEREUNION => INSERT INTO reunion ${createSqlFormater(params)}`);
  tempClient.query(`INSERT INTO reunion ${createSqlFormater(params)}`, (err, res) => {
    if (err) {
      console.log('error sql', err);
      console.log('res sql', res);
      return rej({ tutoName: 'createReunion', err });
    }
    tempClient.end();
    return resolve(params);
  });
  // rej({ tutoName: 'createReunion', err: 'no sql response' });
});

const listReunion = ({ sqlFilters, logs }) => new Promise((resolve) => {
  console.log('sqlFilters', `"${sqlFilters}"`);
  const tempClient = client();
  tempClient.connect();
  if (logs) console.log(`SQL LISTREUNION => "SELECT * FROM reunion${sqlFilters};"`);
  tempClient.query(`SELECT * FROM reunion${sqlFilters};`, (err, res) => {
    if (err) {
      console.log('error', err);
      return null;
    }
    tempClient.end();
    return resolve(res.rows);
  });
});

const getReunionById = id => new Promise((resolve) => {
  const tempClient = client();
  tempClient.connect();
  console.log(`SQL GETREUNIONBYID => SELECT * FROM reunion where id = '${id}' ;`);
  tempClient.query(`SELECT * FROM reunion where id = '${id}' ;`, (err, res) => {
    if (err) {
      console.log('error', err);
      return null;
    }
    tempClient.end();
    return resolve(res.rows[0]);
  });
});

const updateReunion = (id, params) => new Promise((resolve) => {
  const tempClient = client();
  tempClient.connect();
  console.log(`SQL UPDATEREUNION => UPDATE reunion SET ${generalFormater(params)} WHERE id = '${id}'`);
  tempClient.query(`UPDATE reunion SET ${generalFormater(params)} WHERE id = '${id}'`, (err, res) => {
    if (err) {
      console.log('error', err);
      return null;
    }
    tempClient.end();
    return resolve(res.rows[0]);
  });
});

module.exports = {
  createReunion,
  listReunion,
  getReunionById,
  updateReunion
};
