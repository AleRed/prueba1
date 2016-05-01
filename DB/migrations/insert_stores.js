/**
 * Created by Ale on 30/04/2016.
 */

var knex = require('../config');
var Bookshelf = require('bookshelf')(knex);
var db = require('../db_models');
var Promise = require('bluebird');

var N_STORES = 100;

db.Province.fetchAll()
  .then(function(data){
    var provinces = data.toJSON();
    var n_provinces = provinces.length;
    var stores_array = [];

    for(var i = 1; i <= N_STORES; i++){
      stores_array.push({name: 'Store_' + i, province_id: Math.floor(Math.random() * n_provinces)});
    }

    return Promise.map(stores_array, function(store){
        return new db.Store({name: store.name, province_id: store.province_id}).save();
      });

  })
  .then(function(){
    console.log("Stores created!");
    Bookshelf.knex.client.destroy();
  })
  .catch(function(err){
    console.log(err);
    console.log("ERROR en insert_stores");
    Bookshelf.knex.client.destroy();
  });