const { Client } = require('pg');
const client = () => new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const reunionAddPg = (params) => {
  tempClient = client();
  tempClient.connect();
  tempClient.query(`INSERT INTO reunion VALUES('${params.id}', '${params.name}', '${params.date}', '${params.user_id}', '${params.created_at}');`, (err, res) => {
    if (err) console.log(err);
    tempClient.end();
    return res;
  });
}

const reunionList = () => {
  return new Promise((resolve, rej) => {
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

module.exports = {
  reunionAddPg,
  reunionList
}