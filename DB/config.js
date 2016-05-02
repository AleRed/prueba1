/**
 * Created by Ale on 30/04/2016.
 */

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'developer',
    password : 'dev3lop3R',
    database : 'test_db',
    charset  : 'utf8'
  }
});

module.exports = knex;