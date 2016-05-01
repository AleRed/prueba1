/**
 * Created by Ale on 30/04/2016.
 */

var knex = require('../config');
var Bookshelf = require('bookshelf')(knex);
var db = require('../db_models');
var Promise = require('bluebird');

var categories = [
  'department',
  'store',
  'payment_type',
  'date_week',
  'date_month',
  'date_year'
];


Promise.map(categories, function(category){
    return new db.Category({name: category}).save();
  })
  .then(function(){
    console.log("Categories created!");
    Bookshelf.knex.client.destroy();
  })
  .catch(function(err){
    console.log(err);
    console.log("ERROR en insert_categories");
    Bookshelf.knex.client.destroy();
  });