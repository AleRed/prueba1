/**
 * Created by Ale on 02/05/2016.
 */

/*
 *   Bar chart creation library
 * */

function createBarChart(graphic_width, graphic_height, graphic_margin, graphic_div) {
  var svg = d3.select("#" + graphic_div).append("svg")
    .attr("id", "bar_chart_svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 " + graphic_width + " " + graphic_height)
    .attr("preserveAspectRatio", "xMinYMin meet");

  svg.append("g")
    .attr("transform", "translate(" + graphic_margin.left + "," + graphic_margin.top + ")")
    .attr("class", "bar_chart_g");

  svg.append("g")
    .attr("class", "bar_chart_legend_g");
}


function loadBarChartGraphic(data, graphic_width, graphic_height, graphic_margin, graphic_div) {
  var width = graphic_width - graphic_margin.left - graphic_margin.right;
  var height = graphic_height - graphic_margin.top - graphic_margin.bottom;

  var chart = d3.select("#" + graphic_div).selectAll(".bar_chart_g");

  /* Escala del eje X */
  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2)
    .domain(data.map(function (d) {
      return d.x;
    }));

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  /* Escala del eje Y */
  var y = d3.scale.linear()
    .range([height, 0])
    .domain([0, d3.max(data, function (d) {
      return d.y;
    })]);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  /* Seleccion de los ejes o creacion de los mismos si se esta dibujando el grafico por primera vez */
  var y1 = chart.selectAll(".y_axis");
  y1.transition().duration(1000)
    .call(yAxis);

  var x1 = chart.selectAll(".x_axis");
  x1.transition().duration(1000)
    .call(xAxis);

  if (x1[0].length == 0) {          // Cuando lenght = 0 significa que los ejes no se han creado todavia
    var x_initial = d3.scale.ordinal()
      .rangeRoundBands([0, 0], .2)
      .domain(0, 0);

    var xAxis_initial = d3.svg.axis()
      .scale(x_initial)
      .orient("bottom");

    var axis_g = chart.append("g")
      .attr("class", "x_axis axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis_initial)
      .transition().duration(1000).delay(1000)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", function(){
        if(data.length > 20)
          return "translate(-20, 15) rotate(-45)";
      });
  }

  if (y1[0].length == 0) {

    var y_initial = d3.scale.linear()
      .range([height, height])
      .domain([0, 0]);

    var yAxis_initial = d3.svg.axis()
      .scale(y_initial)
      .orient("left");

    chart.append("g")
      .attr("class", "y_axis axis")
      .call(yAxis_initial)
      .transition().duration(1000).delay(1000)
      .call(yAxis);
  }


  /* Creacion del div del tooltip */
  //var tooltip_div = d3.select("#" + graphic_div).append("div")
  //  .attr("class", "tooltip")
  //  .style("opacity", 0);

  var bar = chart.selectAll(".column_g")
    .data(data, function (d) {
      return d.x
    });

  // UPDATE
  bar.select("rect").transition().delay(2000).duration(1000)
    .attr("height", function (d) {
      return height - y(d.y);
    })
    .attr("y", function (d) {
      return y(d.y);
    })
    .attr("x", function (d) {
      return x(d.x);
    })
    .attr("width", x.rangeBand());

  //ENTER
  var g = bar.enter().append("g").attr("class", "column_g");

  g.append("rect")
    .attr("id", function (d) {
      return d.x + "_rect";
    })
    .attr("class", "bar_chart_rect")
    .attr("style", "opacity: 0.7")
    .attr("x", function (d) {
      return x(d.x);
    })
    .attr("y", height)
    .attr("width", x.rangeBand())
    .attr("height", 0)
    .transition()
    .delay(2000)
    .duration(1000)
    .attr("height", function (d) {
      return height - y(d.y);
    })
    .attr("y", function (d) {
      return y(d.y);
    });

  //g.on("mouseover", function(d){
  //    tooltip_div.transition()
  //      .duration(200)
  //      .style("opacity",.9);
  //    tooltip_div.html(
  //        "Period: " + d.period +
  //        "<br/>" +
  //        "Value: " + d.value)
  //      .style("left", x(d.x) + graphic_margin.left + "px")
  //      .style("top", d3.event.pageY - graphic_margin.top + "px");
  //  })
  //  .on("mousemove", function(d){
  //    console.log(x(d.x));
  //    console.log(x(d.x) + graphic_margin.left);
  //    console.log(x(d.x) + graphic_margin.left + "px");
  //    tooltip_div
  //      .style("left", x(d.x) + graphic_margin.left + "px")
  //      .style("top", d3.event.pageY - graphic_margin.top + "px");
  //  })
  //  .on("mouseout", function(){
  //    tooltip_div.transition().duration(200).style("opacity", 0);
  //  });

  //EXIT
  bar.exit().selectAll("rect").transition().duration(1000).attr("height", 0).attr("y", height).remove();
  bar.exit().remove();

}


/*

 */
function removeBarChartGraphic(graphic_width, graphic_height, graphic_margin, graphic_div) {
  var width = graphic_width - graphic_margin.left - graphic_margin.right;
  var height = graphic_height - graphic_margin.top - graphic_margin.bottom;
  var chart = d3.select("#" + graphic_div).selectAll(".bar_chart_g");

  chart.selectAll(".bar_chart_rect")
    .transition()
    .duration(1000)
    .attr("height", 0)
    .attr("y", height);

  /* Escala del eje Y */
  var y = d3.scale.linear()
    .range([height, height])
    .domain([0, 0]);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  /* Seleccion de los ejes o creacion de los mismos si se esta dibujando el grafico por primera vez */
  var y1 = chart.selectAll(".y_axis");
  y1.transition().delay(1000).duration(1000)
    .call(yAxis);

  /* Escala del eje X */
  var x = d3.scale.ordinal()
    .rangeRoundBands([0, 0], .2)
    .domain(0, 0);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var x1 = chart.selectAll(".x_axis");
  x1.transition().delay(1000).duration(1000)
    .call(xAxis);

  chart.transition().delay(2000).remove();
  d3.select("#" + graphic_div).selectAll("#bar_chart_svg").transition().duration(2000).remove();
  d3.select("#" + graphic_div).select(".tooltip").remove();

}