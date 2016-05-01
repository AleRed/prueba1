/**
 * Created by Ale on 30/04/2016.
 */

var knex = require('../config');
var Bookshelf = require('bookshelf')(knex);
var db = require('../db_models');
var Promise = require('bluebird');

var graphic_types = [
  'bar_chart',
  'treemap',
  'pie_chart',
  'map',
  'line_chart'
];


Promise.map(graphic_types, function(graphic_type){
    return new db.GraphicType({name: graphic_type}).save();
  })
  .then(function(){
    console.log("Graphic types created!");
    Bookshelf.knex.client.destroy();
  })
  .catch(function(err){
    console.log(err);
    console.log("ERROR en insert_graphic_types");
    Bookshelf.knex.client.destroy();
  });