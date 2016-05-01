/**
 * Created by Ale on 30/04/2016.
 */

var knex = require('../config');
var Bookshelf = require('bookshelf')(knex);
var db = require('../db_models');
var Promise = require('bluebird');

var categories_graphic_types = [
  {category: 'department', grachic_type: 'bar_chart'},
  {category: 'department', grachic_type: 'treemap'},
  {category: 'payment_type', grachic_type: 'bar_chart'},
  {category: 'payment_type', grachic_type: 'pie_chart'},
  {category: 'payment_type', grachic_type: 'treemap'},
  {category: 'store', grachic_type: 'map'},
  {category: 'store', grachic_type: 'bar_chart'},
  {category: 'date_week', grachic_type: 'bar_chart'},
  {category: 'date_week', grachic_type: 'line_chart'},
  {category: 'date_month', grachic_type: 'bar_chart'},
  {category: 'date_month', grachic_type: 'line_chart'},
  {category: 'date_year', grachic_type: 'bar_chart'},
  {category: 'date_year', grachic_type: 'line_chart'}
];

Promise.mapSeries(categories_graphic_types, function(category_graphic_type){
  return Promise.all([
    db.Category.where({name: category_graphic_type.category}).fetch(),
    db.GraphicType.where({name: category_graphic_type.grachic_type}).fetch()
  ])
    .then(function(data){
      return data[0].graphic_types().attach([data[1].id]);
    })
})
  .then(function(){
    console.log("Categories_graphic_types created!");
    Bookshelf.knex.client.destroy();
  })
  .catch(function(err){
    console.log(err);
    console.log("ERROR en insert_categories_graphic_types");
    Bookshelf.knex.client.destroy();
  });

//Promise.all([
//  db.Category.fetchAll(),
//  db.GraphicType.fetchAll()
//])
//  .then(function(data){
//    var categories = data[9].toJSON();
//    var graphic_types = data[1].toJSON();
//    var categories_graphic_types_ids = [];
//
//    categories_graphic_types.forEach(function(category_graphic_type){
//      categories.forEach(function(category){
//        if(category.name == category_graphic_type.category){
//          graphic_types.forEach(function(graphic_type){
//            if(graphic_type.name == category_graphic_type.grachic_type){
//              categories_graphic_types_ids.push({category_id: category.id, graphic_type_id: graphic_type.id});
//            }
//          })
//        }
//      })
//    });
//
//    return Promise.map(categories_graphic_types_ids, function(categories_graphic_types_id){
//      return db.Category
//    })
//})
//
//
//Promise.map(categories, function(category){
//    return new db.Category({name: category}).save();
//  })
//  .then(function(){
//    console.log("Categories created!");
//    Bookshelf.knex.client.destroy();
//  })
//  .catch(function(err){
//    console.log(err);
//    console.log("ERROR en insert_categories");
//    Bookshelf.knex.client.destroy();
//  });