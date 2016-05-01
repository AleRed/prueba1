/**
 * Created by Ale on 30/04/2016.
 */

var knex = require('../config');
var Bookshelf = require('bookshelf')(knex);
var db = require('../db_models');
var Promise = require('bluebird');

var payment_types = [
  'Efectivo',
  'Tarjeta de crédito',
  'Pago móvil',
  'Financiación'
];


Promise.map(payment_types, function(payment_type){
    return new db.PaymentType({name: payment_type}).save();
  })
  .then(function(){
    console.log("Payment types created!");
    Bookshelf.knex.client.destroy();
  })
  .catch(function(err){
    console.log(err);
    console.log("ERROR en insert_payment_types");
    Bookshelf.knex.client.destroy();
  });