/**
 * Created by Ale on 02/05/2016.
 */

var data_provider = require('./data_provider');
var db = require('./db_models');

data_provider.getTreemapData("store")
  .then(function(data){
    console.log(data);
  });

//db.Sale.query(function(q) {
//  q.column(["departments.name as department", "provinces.name as provinces", "payment_types.name as payment_type"]).sum('value as count')
//    .groupBy('departments.name')
//    .groupBy('provinces.name')
//    .groupBy('payment_types.name')
//    .innerJoin('departments', 'sales.department_id', 'departments.id')
//    .innerJoin('stores', 'sales.store_id', 'stores.id')
//    .innerJoin('provinces', 'stores.province_id', 'provinces.id')
//    .innerJoin('payment_types', 'sales.payment_type_id', 'payment_types.id')
//}).fetchAll()
//  .then(function(data){
//    console.log(data.toJSON());
//  });