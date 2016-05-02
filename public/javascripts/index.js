/**
 * Created by Ale on 10/04/2016.
 */

$(document).ready(function () {

  var bar_chart_data = [
    {period: "1", value: 20},
    {period: "2", value: 50},
    {period: "3", value: 35},
    {period: "4", value: 45},
    {period: "5", value: 21},
    {period: "6", value: 1},
    {period: "7", value: 12},
    {period: "8", value: 15}
  ];

  var line_graphic_data = [
    {"x":"1", "y":10},
    {"x":"2", "y":15},
    {"x":"3", "y":21},
    {"x":"4", "y":11},
    {"x":"5", "y":35},
    {"x":"6", "y":45},
    {"x":"7", "y":10},
    {"x":"8", "y":85}
  ];

  var pie_chart_data = [
    {"key": "Pago movil", "value": 300},
    {"key": "Financiacion", "value": 450},
    {"key": "Efectivo", "value": 1200},
    {"key": "Tarjeta de crédito", "value": 800}];

  var treemap_graphic_data = [
    {"level1": 2011, "level2":"Store_1", "key": "Alimentacion", "value": 7},
    {"level1": 2011, "level2":"Store_1", "key": "Textil", "value": 6},
    {"level1": 2011, "level2":"Store_2", "key": "Menaje", "value": 8},
    {"level1": 2011, "level2":"Store_3", "key": "Alimentacion", "value": 7},
    {"level1": 2011, "level2":"Store_3", "key": "Textil", "value": 7},
    {"level1": 2012, "level2":"Store_1", "key": "Alimentacion", "value": 9},
    {"level1": 2012, "level2":"Store_1", "key": "Textil", "value": 6},
    {"level1": 2012, "level2":"Store_1", "key": "Menaje", "value": 10},
    {"level1": 2012, "level2":"Store_1", "key": "Juguetería", "value": 8},
    {"level1": 2012, "level2":"Store_4", "key": "Alimentacion", "value": 5},
    {"level1": 2012, "level2":"Store_4", "key": "Textil", "value": 3},
    {"level1": 2013, "level2":"Store_1", "key": "Alimentacion", "value": 6},
    {"level1": 2013, "level2":"Store_2", "key": "Alimentacion", "value": 7},
    {"level1": 2013, "level2":"Store_3", "key": "Textil", "value": 5},
    {"level1": 2013, "level2":"Store_4", "key": "Alimentacion", "value": 10},
    {"level1": 2013, "level2":"Store_4", "key": "Textil", "value": 6},
    {"level1": 2013, "level2":"Store_4", "key": "Menaje", "value": 9},
    {"level1": 2013, "level2":"Store_5", "key": "Juguetería", "value": 8},
  ];


  var addGraphicToInterface = function(graphic_title){
    var container_id = graphic_title.replace(' ', '_');

    $("#graphics-titles-container ul").append(
      "<li id='" + container_id + "_li'><a href='#" + container_id + "'>" + graphic_title + "</a></li>"
    );
    $("#graphics-container").append(
      "<div id='" + container_id + "'>" +
      "<h2>" + graphic_title + "</h2>" +
      "<div id='" + container_id + "_graphic' class='graphic-container'></div>" +
      "</div>" +
      "<hr>"
    );

    var graphic_width = document.getElementById(container_id).offsetWidth;
    var graphic_height = document.getElementById(container_id).offsetHeight;
    var graphic_margin = {top: 50, right: 30, bottom: 60, left: 100};

    //createBarChart(graphic_width, graphic_height, graphic_margin, container_id + "_graphic");
    //loadBarChartGraphic(bar_chart_data, graphic_width, graphic_height, graphic_margin, container_id + "_graphic");
    //createLineChart(graphic_width, graphic_height, graphic_margin, container_id + "_graphic");
    //loadLineChart(line_graphic_data, graphic_width, graphic_height, graphic_margin, container_id + "_graphic");
    //createTreemap(graphic_width, graphic_height, graphic_margin, container_id + "_graphic");
    //loadTreemap(treemap_graphic_data, graphic_width, graphic_height, graphic_margin, container_id + "_graphic", false, 2);
    createPieChart(graphic_width, graphic_height, graphic_margin, container_id + "_graphic");
    loadPieChartGraphic(pie_chart_data, graphic_width, graphic_height, graphic_margin, container_id + "_graphic")


    // Scroll al elemento creado
    $('html, body').animate({
      scrollTop: $("#" + container_id).offset().top
    }, 500);


  };

  /*********************************************************************************************************************
   * ADD GRAPH BUTTON
   ********************************************************************************************************************/
  $("#add-graphic-button").on("click", function(){
    var new_section = 'Section X';
    addGraphicToInterface(new_section);
  });

  /*********************************************************************************************************************
   * FUNCIONALIDAD DE SCROLL
   ********************************************************************************************************************/

  //var sections = ['Section A', 'Section B', 'Section C'];
  //
  //sections.forEach(function(section){
  //  addGraphicToInterface(section);
  //});

  $('body').scrollspy({ target: '#graphics-titles-container' });

  /*********************************************************************************************************************
   * CONTROL DE LOS FILTROS
   ********************************************************************************************************************/
  $("#filter-by-select").on("change", function(){
    var value = $(this).val();


    $('#filter-value-select')
      .find('option')
      .remove();

    if(value == "none"){
      $("#filter-value-span").fadeOut(100);
      $("#filter-value-select").fadeOut(100);
    } else {
      $("#filter-value-span").fadeIn(100);
      $("#filter-value-select").fadeIn(100);
      if(value == "department"){
        var new_options = [
          {value: "food", text: "Alimentación"},
          {value: "clothes", text: "Textil"},
          {value: "home", text: "Menaje"}
        ];
      } else if(value == "payment_type"){
        var new_options = [
          {value: "cash", text: "Efectivo"},
          {value: "credit_card", text: "Tarjeta de crédito"},
          {value: "mobile_phone", text: "Pago móvil"},
          {value: "financing", text: "Financiación"}
        ]
      } else if(value == "store"){
        var new_options = [
          {value: "store1", text: "Store_1"},
          {value: "store2", text: "Store_2"},
          {value: "store3", text: "Store_3"},
          {value: "store4", text: "Store_4"},
          {value: "store5", text: "Store_5"}
        ]
      } else if(value == "date"){

      }

      $.each(new_options, function (i, option) {
        $('#filter-value-select').append($('<option>', {
          value: option.value,
          text : option.text
        }));
      });
    }


  })
});


