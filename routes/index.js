var express = require('express');
var router = express.Router();
var data_provider = require('../DB/data_provider');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/add_graphic', function(req, res, next) {
  //console.log(req.query.name);
  var graphic_type = req.query.graphic_type;
  var group_category = req.query.group_by;

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

  //res.send([{name: "hola", value: 2},{name: "adios", value: 5}]);
});

module.exports = router;
