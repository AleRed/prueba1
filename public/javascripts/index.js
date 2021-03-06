/**
 * Created by Ale on 10/04/2016.
 */

$(document).ready(function () {
  console.log(user_id);
  console.log(graphics_data);


  var addGraphicToInterface = function(graphic_title, data, graphic_type){
    var container_id = graphic_title.split(' ').join('_');

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

    if(graphic_type == "line_chart"){
      createLineChart(graphic_width, graphic_height, graphic_margin, container_id + "_graphic");
      loadLineChart(data, graphic_width, graphic_height, graphic_margin, container_id + "_graphic");
    } else if(graphic_type == "bar_chart"){
      createBarChart(graphic_width, graphic_height, graphic_margin, container_id + "_graphic");
      loadBarChartGraphic(data, graphic_width, graphic_height, graphic_margin, container_id + "_graphic");
    } else if(graphic_type == "pie_chart"){
      createPieChart(graphic_width, graphic_height, graphic_margin, container_id + "_graphic");
      loadPieChartGraphic(data, graphic_width, graphic_height, graphic_margin, container_id + "_graphic")
    } else if(graphic_type == "treemap"){
      createTreemap(graphic_width, graphic_height, graphic_margin, container_id + "_graphic");
      loadTreemap(data, graphic_width, graphic_height, graphic_margin, container_id + "_graphic", false, Object.keys(data[0]).length - 2);
    }

    // Scroll al elemento creado
    $('html, body').animate({
      scrollTop: $("#" + container_id).offset().top
    }, 500);
  };

  setTimeout(function(){
    graphics_data.forEach(function(graphic){
      var title = graphic.graphic_type + " by " + graphic.category;
      var data = graphic.data;
      addGraphicToInterface(title, data, graphic.graphic_type);
    });
  }, 1000);



  /*********************************************************************************************************************
   * ADD GRAPH BUTTON
   ********************************************************************************************************************/
  $("#add-graphic-button").on("click", function(){
    var graphic_type = $("#graphic-type-button option:selected").val();
    var group_by = $("#group-by-select option:selected").val();
    var graphic_type_text = $("#graphic-type-button option:selected").text();
    var group_by_text = $("#group-by-select option:selected").text();

    var filter_type = $("#filter-by-select").val();


    if(filter_type == "none"){
      $.get("add_graphic", {graphic_type: graphic_type, group_by: group_by, user_id: user_id}, function( data ) {
        //console.log(data);
        var title = graphic_type_text + " by " + group_by_text;
        addGraphicToInterface(title, data, graphic_type, "normal_graphic");
      });
    } else {
      var filter_value = $("#filter-value-select").val();
      $.get("add_graphic_with_filter", {graphic_type: graphic_type, group_by: group_by, filter_type: filter_type, filter_value: filter_value, user_id: user_id}, function( data ) {
        var title = graphic_type_text + " by " + group_by_text + " where " + filter_type + " is " + filter_value;
        addGraphicToInterface(title, data, graphic_type, "normal_graphic");
      });
    }


  });

  /*********************************************************************************************************************
   * FUNCIONALIDAD DE SCROLL
   ********************************************************************************************************************/

  $('body').scrollspy({ target: '#graphics-titles-container' });

  /*********************************************************************************************************************
   * CONTROL DE LOS FILTROS
   ********************************************************************************************************************/

  /**
   *
   * */
  var changeFilterSelector = function(value){
    $('#filter-by-select')
      .find('option')
      .remove();

    if(value == "department"){
      var new_options = [
        {value: "none", text: "None"},
        {value: "payment_type", text: "Payment Type"}
      ];
    } else if(value == "payment_type"){
      var new_options = [
        {value: "none", text: "None"},
        {value: "department", text: "Department"}
      ];
    } else if(value == "store" || value == "date_year" || value == "date_month"){
      var new_options = [
        {value: "none", text: "None"},
        {value: "department", text: "Department"},
        {value: "payment_type", text: "Payment Type"}
      ];
    }

    $.each(new_options, function (i, option) {
      $('#filter-by-select').append($('<option>', {
        value: option.value,
        text : option.text
      }));
    });
  };


  /* GROUP BY */
  $("#group-by-select").on("change", function(){
    var value = $(this).val();
    changeFilterSelector(value);
  });

  /* GRAPHIC TYPE */

  $("#graphic-type-button").on("change", function() {
    var value = $(this).val();

    $('#group-by-select')
      .find('option')
      .remove();

    if(value == "bar_chart"){
      var new_options = [
        {value: "department", text: "Department"},
        {value: "payment_type", text: "Payment type"},
        {value: "store", text: "Store"},
        {value: "date_month", text: "Monthly"},
        {value: "date_year", text: "Yearly"}
      ];
      changeFilterSelector("department");

    } else if(value == "line_chart"){
      var new_options = [
        {value: "date_month", text: "Monthly"},
        {value: "date_year", text: "Yearly"}
      ];
      changeFilterSelector("date_month");

    } else if(value == "pie_chart"){
      var new_options = [
        {value: "department", text: "Department"},
        {value: "payment_type", text: "Payment type"}
      ];
      changeFilterSelector("department");

    } else if(value == "treemap"){
      var new_options = [
        {value: "department", text: "Department"},
        {value: "payment_type", text: "Payment type"}
      ];
      changeFilterSelector("department");
    }

    $.each(new_options, function (i, option) {
      $('#group-by-select').append($('<option>', {
        value: option.value,
        text : option.text
      }));
    });

  });

  /* FILTER BY */

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
          {value: "alimentacion", text: "Alimentación"},
          {value: "textil", text: "Textil"},
          {value: "menaje", text: "Menaje"},
          {value: "jugueteria", text: "Juguetería"},
          {value: "electrodomesticos", text: "Electrodomésticos"},
          {value: "tecnologia", text: "Tecnología"},
          {value: "cosmetica", text: "Cosmética"}
        ];
      } else if(value == "payment_type"){
        var new_options = [
          {value: "Efectivo", text: "Efectivo"},
          {value: "Tarjeta de crédito", text: "Tarjeta de crédito"},
          {value: "Pago movil", text: "Pago móvil"},
          {value: "Financiacion", text: "Financiación"}
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


