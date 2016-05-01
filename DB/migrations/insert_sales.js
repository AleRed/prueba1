/**
 * Created by Ale on 30/04/2016.
 */

var knex = require('../config');
var Bookshelf = require('bookshelf')(knex);
var db = require('../db_models');
var Promise = require('bluebird');

var N_SALES = 10000;
var MIN_SALE_VALUE = 10;
var MAX_SALE_VALUE = 10000;

var randomDate = function(start_date, end_date){
  return new Date(start_date.getTime() + Math.random() * (end_date.getTime() - start_date.getTime()));
};


Promise.all([
  db.Department.fetchAll(),
  db.PaymentType.fetchAll(),
  db.Store.fetchAll()
])
  .then(function(data){
    var departments = data[0].toJSON();
    var payment_types = data[1].toJSON();
    var stores = data[2].toJSON();
    var sales = [];

    for(var i = 0; i < N_SALES; i++){
      var new_sale = {};
      new_sale.date = randomDate(new Date(2011, 0, 1), new Date());
      new_sale.department_id = departments[Math.floor(Math.random() * departments.length)].id;
      new_sale.payment_type_id = payment_types[Math.floor(Math.random() * payment_types.length)].id;
      new_sale.store_id = stores[Math.floor(Math.random() * stores.length)].id;
      new_sale.value = MIN_SALE_VALUE + (Math.random() * (MAX_SALE_VALUE - MIN_SALE_VALUE)).toFixed(2);

      sales.push(new_sale);
    }


    return Promise.map(sales, function(sale){
        return new db.Sale({
          description: null,
          value: sale.value,
          date: sale.date,
          department_id: sale.department_id,
          payment_type_id: sale.payment_type_id,
          store_id: sale.store_id
        }).save();
      });

  })
  .then(function(){
    console.log("Sales created!");
    Bookshelf.knex.client.destroy();
  })
  .catch(function(err){
    console.log(err);
    console.log("ERROR en insert_sales");
    Bookshelf.knex.client.destroy();
  });