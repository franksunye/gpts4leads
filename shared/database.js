const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: './gpts4leads-saas-app.db'
    },
    useNullAsDefault: true
  });
  
  module.exports = knex;
  