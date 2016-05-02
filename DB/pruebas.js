/**
 * Created by Ale on 02/05/2016.
 */

var data_provider = require('./data_provider');
var data_inserter = require('./data_inserter');
var db = require('./db_models');

var category = "department";
var graphic_type = "line_chart";

data_inserter.insertLoadedVisualizacionWithFilter(category, graphic_type, null, "payment_type", "Efectivo")
  .then(function(data){
    console.log(data.toJSON());
  });

//db.Category.where({name: category}).fetch()
//  .then(function(cat){
//    return db.GraphicType.where({name: graphic_type}).fetch()
//      .then(function(graph){
//        var graphic_type_id = graph.toJSON().id;
//        var category_id = cat.toJSON().id;
//
//        return new db.LoadedVisualization({
//          date: new Date(),
//          category_id: category_id,
//          user_id: null,
//          graphic_type_id: graphic_type_id
//        })
//          .save()
//          .then(function(){
//            console.log("INSERTED!");
//          })
//      })
//  });


//var table1 = "departments";
//var table2 = "provinces";
//
//db.Sale.query(function(q) {
//  q.column([table1 + ".name as level1", table2 + ".name as key"]).sum('value as value')
//    .whereRaw('payment_types.name = "EFECTIVO"')
//    .groupBy(table1 + '.name')
//    .groupBy(table2 + '.name')
//    .innerJoin('departments', 'sales.department_id', 'departments.id')
//    .innerJoin('stores', 'sales.store_id', 'stores.id')
//    .innerJoin('provinces', 'stores.province_id', 'provinces.id')
//    .innerJoin('payment_types', 'sales.payment_type_id', 'payment_types.id')
//}).fetchAll()
//  .then(function(data){
//    console.log(data.toJSON());
//  });


//return db.Sale.query(function(q){
//
//  q.column('departments.name as x').sum('value as y')
//    .whereRaw('payment_types.name = "Efectivo"')
//    .groupBy('department_id')
//    .innerJoin('departments', 'sales.department_id', 'departments.id')
//    .innerJoin('payment_types', 'sales.payment_type_id', 'payment_types.id');
//
//}).fetchAll()
//  .then(function(d){
//    console.log(d.toJSON());
//  });
