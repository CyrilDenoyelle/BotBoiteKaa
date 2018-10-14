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
  // client.connect();
  // client.query(`SELECT * FROM reunion;`, (err, res) => {
  //   if (err) {
  //     console.log(err);
  //     return null;
  //   }
  //   r = []
  //   for (let row of res.rows) {
  //     console.log(row);
  //     r.push(row);
  //   }
  //   client.end();
  //   return r;
  // }).then((e) => {
  //   console.log(e);
  // })

  const results = [];
  // Get a Postgres client from the connection pool
  client.connect((err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM reunion ORDER BY id ASC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });

}

module.exports = {
  reunionAddPg,
  reunionList
}