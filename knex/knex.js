require('@dotenvx/dotenvx').config();
const password = process.env.password;

const knex = require('knex')({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    },
});

// const knex = require('knex')({
//     client: 'pg',
//     connection: {
//       host: '127.0.0.1',
//       port: 5432,
//       user: 'saizayarhein',
//       password: password,
//       database: 'Smart-Brain',
//     },
//   });

module.exports = knex;
