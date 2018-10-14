const { Client } = require('pg');
const client = () => new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const reunionAddPg = (params) => {
  client().connect().query(`INSERT INTO reunion VALUES('${params.id}', '${params.name}', '${params.date}', '${params.user_id}', '${params.created_at}');`, (err, res) => {
    if (err) console.log(err);
    pg.end();
    return res;
  }).end()
}

const reunionList = () => {
  return new Promise((resolve, rej) => {
    client().connect().query(`SELECT * FROM reunion;`, (err, res) => {
      if (err) {
        console.log('error', err);
        return null;
      }
      resolve(res.rows);
    }).end();
  });
};

module.exports = {
  reunionAddPg,
  reunionList
}