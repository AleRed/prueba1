var express = require('express');
var router = express.Router();
var data_provider = require('../DB/data_provider');
var data_inserter = require('../DB/data_inserter');

/**
 * LOGIN
 *
 * */
router.get('/login', function(req, res, next){
  res.render('login');
});

router.post('/login', function(req, res, next){
  data_provider.getUserID(req.body.name, req.body.password)
    .then(function(user){
      if(user != null){
        res.redirect('/?user_id=' + user.toJSON().id);
      } else {
        res.redirect('/login')
      }
    })
});



/**
 * INDEX
 * */
router.get('/', function(req, res, next) {
  if(req.query.user_id == null){
    res.redirect('/login');
  } else {
    res.render('index', { title: 'Express', user_id: req.query.user_id });
  }
});



/**
 * ADD GRAPHIC
 * */
router.get('/add_graphic', function(req, res, next) {
  var graphic_type = req.query.graphic_type;
  var group_category = req.query.group_by;
  var user_id = req.query.user_id;

  data_inserter.insertLoadedVisualizacion(group_category, graphic_type, user_id)
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
  var user_id = req.query.user_id;

  data_inserter.insertLoadedVisualizacionWithFilter(group_category, graphic_type, user_id, filter_type, filter_value)
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
