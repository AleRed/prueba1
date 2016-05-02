/**
 * Created by Ale on 02/05/2016.
 */

/*
 *   Pie chart creation library
 * */

function createPieChart(graphic_width, graphic_height, graphic_margin, graphic_div)
{
  var svg = d3.select("#" + graphic_div).append("svg")
    .attr("id", "pie_chart_svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 " + graphic_width + " " + graphic_height)
    .attr("preserveAspectRatio", "xMinYMin meet");

  svg.append("g")
    .attr("transform", "translate(" + 0 + "," + graphic_margin.top + ")")
    .attr("class", "pie_chart_g");

  svg.append("g")
    .attr("class", "pie_chart_legend_g");
}

function loadPieChartGraphic(data, graphic_width, graphic_height, graphic_margin, graphic_div) {
  var width = graphic_width - graphic_margin.left - graphic_margin.right;
  var height = graphic_height - graphic_margin.top - graphic_margin.bottom;
  var radius = Math.min(width, height)/2;

  var chart = d3.select("#" + graphic_div).selectAll(".pie_chart_g")
    .attr("transform", "translate("+graphic_width/3+", "+graphic_height/2+")");


  var arc_zero = d3.svg.arc()
    .innerRadius(.1)
    .outerRadius(.1);

  var arc = d3.svg.arc()
    .innerRadius(radius - 120)//Cuando mas se reste, pequeño sera el circulo interior
    .outerRadius(radius - 10);

  var color = d3.scale.ordinal()
    //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    //.range(["#ff5400", "#1684ca", "#9ba7ff", "#2b0b30", "#008623", "#18376a", "#fe6dbc", "#CD0A0A", "#8DCD91", "#CEE6ED", "#AC0D36"]);
    .range(["#ff1974", "#012645", "#00ddcd", "#70b2f4", "#9f58e5", "#523a74", "#fe6dbc", "#CD0A0A", "#8DCD91", "#CEE6ED", "#AC0D36"]);

  /* Creacion del div del tooltip */
  //var tooltip_div = d3.select("#" + graphic_div).append("div")
  //  .attr("class", "tooltip")
  //  .style("opacity", 0);

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d){return d.value;});

  data.forEach(function(d){
    d.value = +d.value;
  });

  // ENTER
  var g = chart.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");

  g.append("path")
    .attr("d", arc_zero)
    .style("fill", function(d){
      return color(d.data.key);
    })
    .attr("opacity", 1)
    .transition().delay(2000).duration(1000)
    .attr("d", arc);

  //g.on("mouseover", function(d){
  //    tooltip_div.transition()
  //      .duration(200)
  //      .style("opacity",.9);
  //    if (d.value % 1 === 0)
  //      var n = d.value;
  //    else
  //      var n = parseFloat(d.value).toFixed(3);
  //    tooltip_div.html(
  //        "Area: " + d.data.key +
  //        "<br/>" +
  //        "Value: " + n)
  //      .style("left", (d3.event.pageX) + "px")
  //      .style("top", (d3.event.pageY - 28) + "px");
  //  })
  //  .on("mousemove", function(){
  //    tooltip_div
  //      .style("left", (d3.event.pageX) + "px")
  //      .style("top", (d3.event.pageY - 28) + "px");
  //  })
  //  .on("mouseout", function(){
  //    tooltip_div.transition().duration(200).style("opacity", 0);
  //  });

  for(var i = 0; i < data.length; i++){
    chart.append("rect")
      .attr("class", "pie_chart_legend_rect")
      .attr("x", graphic_margin.left/3 + radius)
      .attr("y", 30*(i+1) - radius)
      .attr("height", 10)
      .attr("width", 0)
      .attr("fill", color(data[i].key))
      .transition().delay(1000).duration(1000).attr("width", 10);

    chart.append("text")
      .attr("class", "line_chart_legend_text")
      .attr("x", graphic_margin.left/3 + radius + 15)
      .attr("y", 30*(i+1) - radius + 5)
      .attr("dy", ".35em")
      .transition().delay(1000)
      .text(data[i].key);
  }

}

function removePieChartGraphic(graphic_width, graphic_height, graphic_margin, graphic_div)
{
  var width = graphic_width - graphic_margin.left - graphic_margin.right;
  var height = graphic_height - graphic_margin.top - graphic_margin.bottom;
  var radius = Math.min(width, height)/2;


  var arc = d3.svg.arc()
    .innerRadius(.1)
    .outerRadius(.1);


  var chart = d3.select("#" + graphic_div).selectAll(".pie_chart_g");
  chart.selectAll("path").transition().duration(1000).attr("d", arc);
  chart.selectAll("path").transition().delay(1000).duration(1000).attr("opacity", 0).remove();
  chart.selectAll(".pie_chart_legend_rect").transition().duration(1000).attr("width", 0);
  chart.selectAll(".line_chart_legend_text").remove();
  d3.select("#" + graphic_div).selectAll("#pie_chart_svg").transition().delay(1000).remove();
}