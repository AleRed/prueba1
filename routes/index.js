var express = require('express');
var router = express.Router();
var data_provider = require('../DB/data_provider');
var data_inserter = require('../DB/data_inserter');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/add_graphic', function(req, res, next) {
  //console.log(req.query.name);
  var graphic_type = req.query.graphic_type;
  var group_category = req.query.group_by;

  data_inserter.insertLoadedVisualizacion(group_category, graphic_type, null)
    .then(function(){
      if(graphic_type == "line_chart" || graphic_type == "bar_chart" || graphic_type == "pie_chart"){
        data_provider.getXYData(graphic_type, group_category)
          .then(function(data){
            res.send(data);
          });
      } else if(graphic_type == "treemap"){
        data_provider.getTreemapData(group_category)
          .then(function(data){
            res.send(data);
          })
      }
    });
});

router.get('/add_graphic_with_filter', function(req, res, next) {
  var graphic_type = req.query.graphic_type;
  var group_category = req.query.group_by;
  var filter_type = req.query.filter_type;
  var filter_value = req.query.filter_value;

  data_inserter.insertLoadedVisualizacionWithFilter(group_category, graphic_type, null, filter_type, filter_value)
    .then(function(){
      console.log("HOLA");
      if(graphic_type == "line_chart" || graphic_type == "bar_chart" || graphic_type == "pie_chart"){
        data_provider.getXYDataWithFilter(graphic_type, group_category, filter_type, filter_value)
          .then(function(data){
            res.send(data);
          });
      } else if(graphic_type == "treemap"){
        data_provider.getTreemapDataWithFilter(group_category, filter_type, filter_value)
          .then(function(data){
            res.send(data);
          })
      }
    });
});

module.exports = router;
