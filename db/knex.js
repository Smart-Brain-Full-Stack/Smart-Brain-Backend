// const knex = require('knex')({
//     client: 'pg',
//     connection: {
//         connectionString: process.env.DATABASE_URL,
//         ssl: {
//             rejectUnauthorized: false
//         }
//     },
// });

const knex = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

module.exports = knex;
