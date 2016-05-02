/**
 * Created by Ale on 02/05/2016.
 */
var array_colors = ["#ae0000", "#2200fd", "#15f900", "#d4fd00", "#ff6700", ]


function createLineChart(graphic_width, graphic_height, graphic_margin, graphic_div) {
  var svg = d3.select("#" + graphic_div).append("svg")
    .attr("id", "line_chart_svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 " + graphic_width + " " + graphic_height)
    .attr("preserveAspectRatio", "xMinYMin meet");

  svg.append("g")
    .attr("transform", "translate(" + graphic_margin.left + "," + graphic_margin.top + ")")
    .attr("class", "line_chart_g");
}


function loadLineChart(data, graphic_width, graphic_height, graphic_margin, graphic_div) {
  var width = graphic_width - graphic_margin.left - graphic_margin.right;
  var height = graphic_height - graphic_margin.top - graphic_margin.bottom;

  var chart = d3.select("#" + graphic_div).selectAll(".line_chart_g");

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width],.2)
    .domain(data.map(function (d) {
      return d.x;
    }));

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var x_initial = d3.scale.ordinal()
    .rangeRoundBands([0, 0], .2)
    .domain(0, 0);

  var xAxis_initial = d3.svg.axis()
    .scale(x_initial)
    .orient("bottom");

  var y = d3.scale.linear()
    .range([height, 0])
    .domain([d3.min(data, function(d){
        return d.y;
      }), d3.max(data, function(d){
        return d.y;
      })
    ]);

  var y_initial = d3.scale.linear()
    .range([height, height])
    .domain([0, 0]);

  var yAxis_initial = d3.svg.axis()
    .scale(y_initial)
    .orient("left");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  /* ELEMENTOS DE LA GRAFICA */
  chart.append("g")
    .attr("class", "axis x_axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis_initial)
    .transition().duration(1000)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", function(){
      if(data.length > 20)
        return "translate(-10, 5) rotate(-45)";
    });


  chart.append("g")
    .attr("class", "y axis y_axis")
    .call(yAxis_initial)
    .transition().duration(1000)
    .transition().duration(1000)
    .call(yAxis);

  var line_zero = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) { return x(d.x) + x.rangeBand()/2; })
    .y(d3.min(data, function(d){
      return d.y;
    }));


  var line = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) { return x(d.x)+ x.rangeBand()/2; })
    .y(function(d) { return y(d.y); });

  chart.append("path")
    .datum(data)
    .attr("id", "line")
    .attr("class", "line")
    .style("stroke", "#0088cc")
    .style("stroke-width", 0)
    .attr("d", line_zero)
    .attr("stroke-opacity", 1)
    .transition().delay(1000).duration(1000)
    .attr("d", line)
    .style("stroke-width", 3);
}