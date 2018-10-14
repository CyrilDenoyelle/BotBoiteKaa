const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const reunionAddPg = (params) => {
  client.connect();
  client.query(`INSERT INTO reunion VALUES('${params.id}', '${params.name}', '${params.date}', '${params.user_id}', '${params.created_at}');`, (err, res) => {
    if (err) console.log(err);
    client.end();
    return res;
  });
}

const reunionList = () => {
  client.connect();
  return new Promise((resolve, rej) => {
    client.query(`SELECT * FROM reunion;`, (err, resp) => {
      if (err) {
        console.log('error', err);
        return null;
      }
      // for (let row of res.rows) {
      //   r.push(row);
      // }
      console.log('res.rows', res.rows);
      return resolve(res.rows);
      // client.end();
    });
  });
};

module.exports = {
  reunionAddPg,
  reunionList
}