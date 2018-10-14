const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const reunionAddPg = (params) => {

  client.connect();
  // ${process.env.DB_DATABASE}



  client.query(`INSERT INTO reunion VALUES('${params.name}', '${params.date}', '${params.user_id}', '${params.created_at}');`, (err, res) => {
    if (err) console.log(err);
    // for (let row of res.rows) {
    //   console.log(JSON.stringify(row));
    // }
    client.end();
  });

  // client.end();
}

module.exports = {
  reunionAddPg
}