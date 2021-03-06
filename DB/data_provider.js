/**
 * Created by Ale on 02/05/2016.
 */
var db = require('./db_models');
var moment = require('moment');
var Promise = require('bluebird');

var data_provider = {};



/**
 *
 *
 *
 * */
data_provider.getXYData = function(graphic_type, group_by){

  if(graphic_type == "line_chart" || graphic_type == "bar_chart"){
    var x_name = "x";
    var y_name = "y";
  } else if(graphic_type == "pie_chart") {
    var x_name = "key";
    var y_name = "value";
  }

  if(group_by == "department" || group_by == "store" || group_by == "payment_type"){
    var table_name = group_by + "s";
    var id_name = group_by + "_id";
    return db.Sale.query(function(q){

      q.column(table_name + '.name as ' + x_name).sum('value as ' + y_name)
        .groupBy(id_name)
        .innerJoin(table_name, 'sales.' + id_name, table_name + '.id');

    }).fetchAll()
      .then(function(data){
        return new Promise(function(resolve){
          return resolve(data.toJSON());
        })
      });

  } else if(group_by == "date_month"){
    return db.Sale.query(function(q){
      q.column("sales.date as x").sum('value as y')
        .groupByRaw("YEAR(sales.date)*100+MONTH(sales.date)")
        .orderByRaw("YEAR(sales.date), MONTH(sales.date)");

    }).fetchAll()
      .then(function(data){
        return new Promise(function(resolve){
          var json_data = data.toJSON();
          var new_data = [];
          json_data.forEach(function(d){
            var date = moment(d.x);
            var new_element = {};
            new_element[x_name] = date.format('MM') + '/' + date.format('YY');
            new_element[y_name] = d.y;
            new_data.push(new_element);
          });

          //console.log(new_data);
          return resolve(new_data);
        });
      });

  } else if(group_by == "date_year"){

    return db.Sale.query(function(q){
      q.column("sales.date as x").sum('value as y')
        .groupByRaw("YEAR(sales.date)")
        .orderByRaw("YEAR(sales.date)");

    }).fetchAll()
      .then(function(data){
        return new Promise(function(resolve){
          var json_data = data.toJSON();
          var new_data = [];
          json_data.forEach(function(d){
            var date = moment(d.x);
            var new_element = {};
            new_element[x_name] = date.format('YYYY');
            new_element[y_name] = d.y;
            new_data.push(new_element);
          });

          return resolve(new_data);
        });
      });
  }
};


/**
 *
 *
 *
 * */
data_provider.getTreemapData = function(group_by) {
  if (group_by == "department"){
    var table1 = "departments";
    var table2 = "provinces";
    var table3 = "payment_types";

  } else if (group_by == "store"){
    var table1 = "provinces";
    var table2 = "payment_types";
    var table3 = "departments";

  } else if (group_by == "payment_type"){
    var table1 = "payment_types";
    var table2 = "departments";
    var table3 = "provinces";
  }

  return db.Sale.query(function(q) {
    q.column([table1 + ".name as level1", table2 + ".name as level2", table3 + ".name as key"]).sum('value as value')
      .groupBy(table1 + '.name')
      .groupBy(table2 + '.name')
      .groupBy(table3 + '.name')
      .innerJoin('departments', 'sales.department_id', 'departments.id')
      .innerJoin('stores', 'sales.store_id', 'stores.id')
      .innerJoin('provinces', 'stores.province_id', 'provinces.id')
      .innerJoin('payment_types', 'sales.payment_type_id', 'payment_types.id')
  }).fetchAll()
    .then(function(data){
      return new Promise(function(resolve){
        return resolve(data.toJSON());
      })
    });
};


/**
 *
 *
 *
 * */
data_provider.getXYDataWithFilter = function(graphic_type, group_by, filter_type, filter_value){
  if(graphic_type == "line_chart" || graphic_type == "bar_chart"){
    var x_name = "x";
    var y_name = "y";
  } else if(graphic_type == "pie_chart") {
    var x_name = "key";
    var y_name = "value";
  }
  var filter_table_name = filter_type + "s";

  if(group_by == "department" || group_by == "payment_type" || group_by == "store"){
    var table_name = group_by + "s";
    var id_name = group_by + "_id";
    return db.Sale.query(function(q){

      q.column(table_name + '.name as ' + x_name).sum('value as ' + y_name)
        .whereRaw(filter_table_name + '.name = "' + filter_value + '"')
        .groupBy(id_name)
        .innerJoin('departments', 'sales.department_id', 'departments.id')
        .innerJoin('payment_types', 'sales.payment_type_id', 'payment_types.id')
        .innerJoin('stores', 'sales.store_id', 'stores.id');

    }).fetchAll()
      .then(function(data){
        return new Promise(function(resolve){
          return resolve(data.toJSON());
        })
      });

  } else if(group_by == "date_month"){
    return db.Sale.query(function(q){
      q.column("sales.date as x").sum('value as y')
        .whereRaw(filter_table_name + '.name = "' + filter_value + '"')
        .groupByRaw("YEAR(sales.date)*100+MONTH(sales.date)")
        .orderByRaw("YEAR(sales.date), MONTH(sales.date)")
        .innerJoin('departments', 'sales.department_id', 'departments.id')
        .innerJoin('payment_types', 'sales.payment_type_id', 'payment_types.id');

    }).fetchAll()
      .then(function(data){
        return new Promise(function(resolve){
          var json_data = data.toJSON();
          var new_data = [];
          json_data.forEach(function(d){
            var date = moment(d.x);
            var new_element = {};
            new_element[x_name] = date.format('MM') + '/' + date.format('YY');
            new_element[y_name] = d.y;
            new_data.push(new_element);
          });

          return resolve(new_data);
        });
      });
  } else if (group_by == "date_year"){
    return db.Sale.query(function(q){
      q.column("sales.date as x").sum('value as y')
        .whereRaw(filter_table_name + '.name = "' + filter_value + '"')
        .groupByRaw("YEAR(sales.date)")
        .orderByRaw("YEAR(sales.date)")
        .innerJoin('departments', 'sales.department_id', 'departments.id')
        .innerJoin('payment_types', 'sales.payment_type_id', 'payment_types.id');

    }).fetchAll()
      .then(function(data){
        return new Promise(function(resolve){
          var json_data = data.toJSON();
          var new_data = [];
          json_data.forEach(function(d){
            var date = moment(d.x);
            var new_element = {};
            new_element[x_name] = date.format('YYYY');
            new_element[y_name] = d.y;
            new_data.push(new_element);
          });

          return resolve(new_data);
        });
      });
  }
};



/**
 *
 *
 *
 * */
data_provider.getTreemapDataWithFilter = function(group_by, filter_type, filter_value){
  if (group_by == "department"){
    var table1 = "departments";
    var table2 = "provinces";

  } else if (group_by == "payment_type"){
    var table1 = "payment_types";
    //var table2 = "departments";
    var table2 = "provinces";
  }

  var filter_table_name = filter_type + "s";

  return db.Sale.query(function(q) {
    q.column([table1 + ".name as level1", table2 + ".name as key"]).sum('value as value')
      .whereRaw(filter_table_name + '.name = "' + filter_value + '"')
      .groupBy(table1 + '.name')
      .groupBy(table2 + '.name')
      .innerJoin('departments', 'sales.department_id', 'departments.id')
      .innerJoin('stores', 'sales.store_id', 'stores.id')
      .innerJoin('provinces', 'stores.province_id', 'provinces.id')
      .innerJoin('payment_types', 'sales.payment_type_id', 'payment_types.id')
  }).fetchAll()
    .then(function(data){
      return new Promise(function(resolve){
        return resolve(data.toJSON());
      })
    });
};


/**
 *
 *
 * */
data_provider.getUserID = function(name, password){
  return db.User.where({name: name, password: password}).fetch();
};

data_provider.getFavouritesCategoriesForUser = function(user_id){
  return db.LoadedVisualization.query(function(q) {
    q.column('categories.name').count('* as suma')
      .whereRaw('loaded_visualizations.user_id = ' + user_id)
      .innerJoin('categories', 'loaded_visualizations.category_id', 'categories.id')
      .groupBy('loaded_visualizations.category_id')
      .orderByRaw('suma desc')
      .limit(2)
  }).fetchAll()
};

data_provider.getFavouritesCategoriesWithoutUser = function(user_id){
  return db.LoadedVisualization.query(function(q) {
    q.column('categories.name').count('* as suma')
      .whereRaw('loaded_visualizations.user_id <> ' + user_id)
      .innerJoin('categories', 'loaded_visualizations.category_id', 'categories.id')
      .groupBy('loaded_visualizations.category_id')
      .orderByRaw('suma desc')
      .limit(2)
  }).fetchAll()
};

data_provider.getFavouriteGraphicTypeForCategoryAndUser = function(user_id, category){
  return db.LoadedVisualization.query(function(q){
    q.column('categories.name as category', 'graphic_types.name as graphic_type').count('* as suma')
      .whereRaw('loaded_visualizations.user_id = ' + user_id + ' and categories.name = "' + category + '"')
      .innerJoin('categories', 'loaded_visualizations.category_id', 'categories.id')
      .innerJoin('graphic_types', 'loaded_visualizations.graphic_type_id', 'graphic_types.id')
      .groupBy('loaded_visualizations.graphic_type_id')
      .orderByRaw('suma desc')
      .limit(1)
  }).fetch();
};

data_provider.getFavouriteGraphicTypeForCategoryWithoutUser = function(user_id, category){
  return db.LoadedVisualization.query(function(q){
    q.column('categories.name as category', 'graphic_types.name as graphic_type').count('* as suma')
      .whereRaw('loaded_visualizations.user_id <> ' + user_id + ' and categories.name = "' + category + '"')
      .innerJoin('categories', 'loaded_visualizations.category_id', 'categories.id')
      .innerJoin('graphic_types', 'loaded_visualizations.graphic_type_id', 'graphic_types.id')
      .groupBy('loaded_visualizations.graphic_type_id')
      .orderByRaw('suma desc')
      .limit(1)
  }).fetch();
};


/**
 *
 * */
data_provider.getRecommendedGraphicsDataForUser = function(user_id){
  return Promise.all([
    this.getFavouritesCategoriesForUser(user_id)
      .then(function(data){
        var selected_categories = [];
        var favourites_categories = data.toJSON();

        favourites_categories.forEach(function(favourite_category){
          selected_categories.push(favourite_category.name);
        });

        return Promise.mapSeries(selected_categories, function(category){
            return data_provider.getFavouriteGraphicTypeForCategoryAndUser(user_id, category);
          })
          .then(function(graphics){
            return Promise.mapSeries(graphics, function(graphic){
                if(graphic.toJSON().graphic_type == "treemap"){
                  return data_provider.getTreemapData(graphic.toJSON().category)
                } else {
                  return data_provider.getXYData(graphic.toJSON().graphic_type, graphic.toJSON().category);
                }
              })
              .then(function(graphics_data){
                return new Promise(function(resolve){
                  var results = [];
                  graphics.forEach(function(graph, i){
                    results.push({graphic_type: graph.toJSON().graphic_type, category: graph.toJSON().category, data: graphics_data[i]});
                  });
                  resolve(results);
                })
              })
          })
      }),
    this.getFavouritesCategoriesWithoutUser(user_id)
      .then(function(data){
        var selected_categories = [];
        var favourites_categories = data.toJSON();

        favourites_categories.forEach(function(favourite_category){
          selected_categories.push(favourite_category.name);
        });

        return Promise.mapSeries(selected_categories, function(category){
            return data_provider.getFavouriteGraphicTypeForCategoryWithoutUser(user_id, category);
          })
          .then(function(graphics){
            return Promise.mapSeries(graphics, function(graphic){
                if(graphic.toJSON().graphic_type == "treemap"){
                  return data_provider.getTreemapData(graphic.toJSON().category)
                } else {
                  return data_provider.getXYData(graphic.toJSON().graphic_type, graphic.toJSON().category);
                }
              })
              .then(function(graphics_data){
                return new Promise(function(resolve){
                  var results = [];
                  graphics.forEach(function(graph, i){
                    results.push({graphic_type: graph.toJSON().graphic_type, category: graph.toJSON().category, data: graphics_data[i]});
                  });
                  resolve(results);
                })
              })
          })
      })
  ])
    .then(function(data){
      return new Promise(function(resolve){
        var final_result = [];
        data[0].forEach(function(d){
          final_result.push(d)
        });
        data[1].forEach(function(d){
          final_result.push(d)
        });
        resolve(final_result);
      })
    })

}


module.exports = data_provider;