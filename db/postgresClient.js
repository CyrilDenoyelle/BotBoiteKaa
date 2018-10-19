const { Client } = require('pg');
const client = () => new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const updateParamsFormater = (params) => {
  arr = [];
  Object.keys(params).map(paramName => { arr.push(`${paramName} = '${params[paramName]}'`) });
  return arr.join(', ');
}

const createReunion = (params) => {
  return new Promise((resolve, rej) => {
    tempClient = client();
    tempClient.connect();
    console.log('params', params);
    if (typeof params.date !== 'string') {
      tempClient.query(`INSERT INTO reunion VALUES('${Object.values(params).join('\', \'')}')`, (err, res) => {
        if (err) rej('createReunion');
        resolve(params);
        tempClient.end();
      });
    } else {
      rej({ tutoName: 'createReunion' });
    }
  });
};

const listReunion = () => {
  return new Promise((resolve, rej) => {
    tempClient = client();
    tempClient.connect();
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
    console.log(`UPDATE reunion SET ${updateParamsFormater(params)} WHERE id = ${id}`);
    tempClient.query(`UPDATE reunion SET ${updateParamsFormater(params)} WHERE id = '${id}'`, (err, res) => {
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
