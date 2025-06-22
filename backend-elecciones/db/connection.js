const ibmdb = require('ibm_db');

const connStr = `DATABASE=${process.env.DB_NAME};HOSTNAME=${process.env.DB_HOST};PORT=${process.env.DB_PORT};PROTOCOL=TCPIP;UID=${process.env.DB_USER};PWD=${process.env.DB_PASSWORD};`;

function getConnection() {
  return new Promise((resolve, reject) => {
    ibmdb.open(connStr, (err, conn) => {
      if (err) reject(err);
      else resolve(conn);
    });
  });
}

module.exports = { getConnection };
