/**
 * Created by Ale on 02/05/2016.
 */
var db = require('./db_models');
var moment = require('moment');
var Promise = require('bluebird');

var data_provider = {};

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

          console.log(new_data);
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


data_provider.getTreemapData = function(group_by) {
  // || group_by == "store" || group_by == "payment_type"){
  if (group_by == "department"){
    var table1 = "departments";
    var id1 = "department_id";
    //var table2 = "stores";
    //var id2 = "store_id";
    var table2 = "provinces";
    var id2 = "province_id";
    var table3 = "payment_types";
    var id3 = "payment_type_id";

  } else if (group_by == "store"){
    //var table1 = "stores";
    //var id1 = "store_id";
    var table1 = "provinces";
    var id1 = "province_id";
    var table2 = "payment_types";
    var id2 = "payment_type_id";
    var table3 = "departments";
    var id3 = "department_id";

  } else if (group_by == "payment_type"){
    var table1 = "payment_types";
    var id1 = "payment_type_id";
    var table2 = "departments";
    var id2 = "department_id";
    //var table3 = "stores";
    //var id3 = "store_id";
    var table3 = "provinces";
    var id3 = "province_id";
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
        console.log(data.toJSON());
        return resolve(data.toJSON());
      })
    });
};

module.exports = data_provider;