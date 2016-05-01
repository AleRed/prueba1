/**
 * Created by Ale on 30/04/2016.
 */

var knex = require('../config');
var Bookshelf = require('bookshelf')(knex);
var db = require('../db_models');
var Promise = require('bluebird');

var provinces = [
  'Álava',
  //'Albacete',
  'Alicante',
  //'Almería',
  'Asturias',
  //'Ávila',
  //'Badajoz',
  'Barcelona',
  //'Burgos',
  //'Cáceres',
  'Cádiz',
  'Cantabria',
  //'Castellón',
  //'Ciudad Real',
  //'Córdoba',
  'La coruña',
  //'Cuenca',
  //'Gerona',
  //'Granada',
  //'Guadalajara',
  //'Guipúzcoa',
  'Huelva',
  //'Huesca',
  'Islas Baleares',
  //'Jaén',
  //'León',
  //'Lérida',
  //'Lugo',
  'Madrid',
  //'Málaga',
  //'Murcia',
  //'Navarra',
  //'Orense',
  //'Palencia',
  //'Las Palmas',
  //'Pontevedra',
  //'La Rioja',
  //'Salamanca',
  //'Santa Cruz de Tenerife',
  //'Segovia',
  'Sevilla',
  //'Soria',
  //'Tarragona',
  //'Teruel',
  //'Toledo',
  'Valencia',
  //'Valladolid',
  //'Vizcaya',
  //'Zamora',
  //'Zaragoza',
  //'Ceuta',
  //'Melilla'
  ];


Promise.map(provinces, function(province){
    return new db.Province({name: province}).save();
  })
  .then(function(){
    console.log("Provinces created!");
    Bookshelf.knex.client.destroy();
  })
  .catch(function(err){
    console.log(err);
    console.log("ERROR en insert_provinces");
    Bookshelf.knex.client.destroy();
  });