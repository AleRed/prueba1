/**
 * Created by Ale on 10/04/2016.
 */

$(document).ready(function () {

  var addGraphicToInterface = function(graphic_title){
    $("#graphics-titles-container ul").append(
      "<li><a href='#" + graphic_title.replace(' ', '_') + "'>" + graphic_title + "</a></li>"
    );

    $("#graphics-container").append(
      "<div id='" + graphic_title.replace(' ', '_') + "'>" +
      "<h2>" + graphic_title + "</h2>" +
      "<div class='graphic-container'></div>" +
      "</div>" +
      "<hr>"
    );
  };

  /*********************************************************************************************************************
   * ADD GRAPH
   ********************************************************************************************************************/
  $("#add-graphic-button").on("click", function(){
    var new_section = 'Section X';
    addGraphicToInterface(new_section);
  });

  /*********************************************************************************************************************
   * FUNCIONALIDAD DE SCROLL
   ********************************************************************************************************************/

  var sections = ['Section A', 'Section B', 'Section C'];

  sections.forEach(function(section){
    addGraphicToInterface(section);
  });

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


