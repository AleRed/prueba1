/**
 * Created by Ale on 02/05/2016.
 */
var db = require('./db_models');
var moment = require('moment');
var Promise = require('bluebird');

var data_inserter = {};

/**
 *
 *
 * */
data_inserter.insertLoadedVisualizacion = function(category, graphic_type, user_id){
  return db.Category.where({name: category}).fetch()
    .then(function(cat){
      return db.GraphicType.where({name: graphic_type}).fetch()
        .then(function(graph){
          var graphic_type_id = graph.toJSON().id;
          var category_id = cat.toJSON().id;

          return new db.LoadedVisualization({
            date: new Date(),
            category_id: category_id,
            user_id: user_id,
            graphic_type_id: graphic_type_id
          })
            .save();
        })
    });
};

/**
 *
 *
 * */
data_inserter.insertLoadedVisualizacionWithFilter = function(category, graphic_type, user_id, filter_type, filter_value){
  return this.insertLoadedVisualizacion(category, graphic_type, user_id)
    .then(function(loaded_visualization){
      return db.Category.where({name: filter_type}).fetch()
        .then(function(category){
          return new db.Filter({
            condition_value: filter_value,
            category_id: category.toJSON().id
          })
            .save()
            .then(function(inserted_filter){
              return new Promise(function(resolve){
                loaded_visualization.filters().attach([inserted_filter.toJSON().id]);
                return resolve();
              })
            })
        })
    })
}


module.exports = data_inserter;