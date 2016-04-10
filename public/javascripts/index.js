/**
 * Created by Ale on 10/04/2016.
 */

$(document).ready(function () {
  $('body').scrollspy({ target: '#myScrollspy' });

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
          {value: "food", text: "Food"},
          {value: "clothes", text: "Clothes"},
          {value: "home", text: "Home"}
        ];
      } else if(value == "payment_type"){
        var new_options = [
          {value: "cash", text: "Cash"},
          {value: "credit_card", text: "Credit card"},
          {value: "mobile_phone", text: "Mobile phone"},
          {value: "financing", text: "Financing"}
        ]
      } else if(value == "store"){
        var new_options = [
          {value: "store1", text: "Store 1"},
          {value: "store2", text: "Store 2"},
          {value: "store3", text: "Store 3"},
          {value: "store4", text: "Store 4"},
          {value: "store5", text: "Store 5"}
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


