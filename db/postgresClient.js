const { Client } = require('pg');
const uuid = require('uuid');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const reunionAddPg = (params) => {
  client.connect();
  client.query(`INSERT INTO reunion VALUES('${uuid()}', '${params.name}', '${params.date}', '${params.user_id}', '${params.created_at}');`, (err, res) => {
    if (err) console.log(err);
    client.end();
  });
}

const reunionList = () => {
  client.connect();
  client.query(`SELECT * FROM reunion`, (err, res) => {
    if (err) {
      console.log(err);
      return null;
    }
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
    return res && res.rows;
  });

  // client.end();
}

module.exports = {
  reunionAddPg,
  reunionList
}