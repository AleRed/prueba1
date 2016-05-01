/**
 * Created by Ale on 30/04/2016.
 */

var knex = require('../config');
var Bookshelf = require('bookshelf')(knex);
var db = require('../db_models');
var Promise = require('bluebird');

var departments = [
  'Alimentación',
  'Textil',
  'Menaje',
  'Tecnología',
  'Electrodomésticos',
  'Juguetería',
  'Cosmética'
];


Promise.map(departments, function(department){
  return new db.Department({name: department}).save();
})
  .then(function(){
    console.log("Departments created!");
    Bookshelf.knex.client.destroy();
  })
  .catch(function(err){
    console.log(err);
    console.log("ERROR en insert_department");
    Bookshelf.knex.client.destroy();
  });