/**
 * Created by Ale on 02/05/2016.
 */

function createTreemap(graphic_width, graphic_height, graphic_margin, graphic_div)
{
  var svg = d3.select("#" + graphic_div).append("svg")
    .attr("id", "treemap_svg")
    .style("margin-top", graphic_margin.top/2)
    .style("margin-bottom", graphic_margin.top/2)
    .style("margin-left", graphic_margin.top/2)
    .style("margin-right", graphic_margin.top/2)
    .attr("width", graphic_width-graphic_margin.top)
    .attr("height", graphic_height-graphic_margin.top)
    .attr("preserveAspectRatio", "xMinYMin meet");

  svg.append("g")
    .attr("transform", "translate(" + 1 + "," + (31).toString() + ")")
    .attr("class", "treemap_g");

  svg.append("g")
    .attr("class", "treemap_legend_g");
}


function loadTreemap(data, graphic_width, graphic_height, graphic_margin, graphic_div, update, n_levels)
{
  var width = graphic_width-2-graphic_margin.top;// - graphic_margin.right;
  var height = graphic_height - graphic_margin.top - graphic_margin.top/2;// - graphic_margin.bottom;
  var chart = d3.select("#" + graphic_div).selectAll(".treemap_g");

  if(n_levels == 2)
  {
    var nest = d3.nest()
      .key(function(d){ return d.level1; })
      .key(function(d){ return d.level2; })
      .entries(data);

    var nestStructure = {
      "key": "Sales",
      "values": nest
    };
  }
  else if(n_levels == 1)
  {
    var nest = d3.nest()
      .key(function(d){ return d.level1; })
      .entries(data);

    var nestStructure = {
      "key": "Recommenders",
      "values": nest
    };
  }

  var transitioning;

  var x = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);

  var y = d3.scale.linear()
    .domain([0, height])
    .range([0, height]);

  var treemap = d3.layout.treemap()
    .value(function(d){ return d.value;})
    .children(function(d, depth) { return depth ? null : d.values; })
    .sort(function(a, b) { return (a.value) - (b.value); })
    .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
    .round(false);

  if(!update){
    var svg = d3.select("#"+graphic_div).selectAll(".treemap_g");

    var grandparent = svg.append("g")
      .attr("class", "grandparent");

    grandparent.append("rect")
      .attr("y", -30)
      .attr("width", width)
      .attr("height", 30)
      .style("stroke-width", "1px")
      .style("stroke", "black");

    grandparent.append("text")
      .attr("x", 6)
      .attr("y", 6 - 30)
      .attr("dy", ".75em")
      .attr("class", "treemap-title-text");
  }
  else{
    var svg = d3.select("#"+graphic_div).selectAll(".treemap_g");
    var grandparent = svg.selectAll(".grandparent");
  }


  var root = nestStructure; //works using the JSON

  initialize(root);
  accumulate(root);
  layout(root);
  if(!update)
    display(root);
  else
    resize(root);

  function initialize(root) {
    root.x = root.y = 0;
    root.dx = width;
    root.dy = height;
    root.depth = 0;
  }

  function accumulate(d) {
    return d.values
      ? d.value = d.values.reduce(function(p, v) { return p + accumulate(v); }, 0)
      : d.value;
  }

  function layout(d) {
    if (d.values) {
      treemap.nodes({values: d.values});
      d.values.forEach(function(c) {
        c.x = d.x + c.x * d.dx;
        c.y = d.y + c.y * d.dy;
        c.dx *= d.dx;
        c.dy *= d.dy;
        c.parent = d;
        layout(c);
      });
    }
  }

  function display(d) {
    grandparent
      .datum(d.parent)
      .on("click", function(d){
        transition(d);
      })
      .select("text")
      .text(key(d));

    var g1 = svg.insert("g", ".grandparent")
      .datum(d)
      .attr("class", "depth");

    var g = g1.selectAll("g")
      .data(d.values)
      .enter().append("g");

    g.filter(function(d) { return d.values; })
      .classed("children", true)
      .on("click", function(d){
        transition(d);
      });

    g.selectAll(".child")
      .data(function(d) { return d.values || [d]; })
      .enter().append("rect")
      .attr("class", "child")
      .style("fill", function(d) {
        return defineColorChild(d);})
      .style("shape-rendering", "geometricPrecision")
      .call(rect);

    g.append("rect")
      .attr("class", "parent")
      .style("fill", function(d) {
        return defineColorParent(d);})
      .call(rect)
      .append("title")
      .text(function(d) {
        var string = "Name: " + d.key + "\nValue: " + d.value.toFixed(2);
        return string;
      });

    g.append("text")
      .attr("dy", ".75em")
      .attr("class", "treemap-text")
      .call(text);

    return g;
  }

  function resize(d) {
    grandparent
      .datum(d.parent)
      .on("click", function (d) {
        transition(d);
      })
      .on("click", transition)
      .select("text")
      .text(key(d));

    var depth = svg.selectAll(".depth").datum(d);

    var g = depth.selectAll("g").data(d.values);

    g.filter(function (d) {
        return d.values;
      })
      .classed("children", true)
      .on("click", function(d){
        transition(d);
      });

    //ENTER 1 --> Mete los nuevos rects con clase "children" que derivan de "depth"
    var newChildren = g.enter().append("g")
      .attr("class", "children")
      .on("click", transition);
    newChildren.append("rect")
      .attr("class", "parent")
      .style("fill", function(d) {
        return defineColorChild(d);})
      .call(rect);
    newChildren.append("text")
      .attr("opacity", 0)
      .attr("dy", ".75em")
      .text(function(d) {return d.key;
      })
      .attr("class", "treemap-text")
      .call(text)
      .transition().delay(1000).duration(1000)
      .attr("opacity", 1);

    g.exit().remove();


    //ENTER 2 --> Mete en cada "children" los rects de clase "child"
    var child = g.selectAll(".child").data(function(d) { return d.values || [d]; });

    child.enter().append("rect")
      .attr("class", "child")
      .style("fill", function(d) {
        return defineColorChild(d);})
      .call(rect)
      .style("shape-rendering", "geometricPrecision");

    //ENTER + UPDATE
    child.attr("class", "child").transition().duration(1000)
      .style("fill", function(d) {
        return defineColorChild(d);})
      .call(rect)
      .style("shape-rendering", "geometricPrecision");

    g.selectAll(".parent").remove();
    g.append("rect")
      .attr("class", "parent")
      .style("fill", function(d) {
        return defineColorParent(d);})
      .call(rect)
      .append("title")
      .text(function(d) {
        var string = "Name: " + d.key + "\nValue: " + d.value.toFixed(2);
        return string;
      });
    g.selectAll(".treemap-text").transition().duration(1000).attr("opacity", 0).remove();
    g.append("text")
      .attr("opacity", 0)
      .attr("dy", ".75em")
      .attr("class", "treemap-text")
      .call(text)
      .transition().delay(1000).duration(1000)
      .attr("opacity", 1);

    //EXIT
    child.exit().remove();
  }

  function transition(d) {
    if (transitioning || !d) return;
    transitioning = true;

    var g1 = svg.selectAll(".depth");

    var g2 = display(d),
      t1 = g1.transition().duration(750),
      t2 = g2.transition().duration(750);

    // Update the domain only after entering new elements.
    x.domain([d.x, d.x + d.dx]);
    y.domain([d.y, d.y + d.dy]);

    // Enable anti-aliasing during the transition.
    svg.style("shape-rendering", "geometricPrecision");

    // Draw child nodes on top of parent nodes.
    svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

    // Fade-in entering text.
    g2.selectAll("text").style("fill-opacity", 0);

    // Transition to the new view.
    t1.selectAll("text").call(text).style("fill-opacity", 0);
    t2.selectAll("text").call(text).style("fill-opacity", 1);
    t1.selectAll("rect").call(rect);
    t2.selectAll("rect").call(rect);

    // Remove the old node when the transition is finished.
    t1.remove().each("end", function() {
      svg.style("shape-rendering", "geometricPrecision");
      transitioning = false;
    });
  }

  function text(text) {
    text.attr("x", function(d) { return x(d.x) + 6; })
      .attr("y", function(d) { return y(d.y) + 6; })
      .text(function(d) {
        var text = d.key;
        var rect_width = x(d.x + d.dx) - x(d.x) - 10;
        if(text.length*9 > rect_width) {
          return text.substring(0, Math.round(rect_width / 9) - 3) + "...";
        }
        else
          return d.key;
      });
  }

  function rect(rect) {
    rect.attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return (y(d.y)); })
      .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
      .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
      .style("opacity", "0.8");
  }

  function key(d) {
    return d.parent
      ? key(d.parent) + "." + d.key
      : d.key;
  }
}

/* Metodo que asigna color en funcion del mttr al que pertenece */
function defineColorChild(d) {
  return "steelblue";
}

function defineColorParent(d){
  if(!d.values)
  {
    if(parseFloat(d.value) >= 4.5)
      return "#7fc291";
    else if(parseFloat(d.value) >= 4)
      return "steelblue";
    else
      return "#FFF68F";
  }
  else
    return "none"
}

function removeTreemap(graphic_width, graphic_height, graphic_margin, graphic_div)
{
  var width = graphic_width - graphic_margin.left - graphic_margin.right;
  var height = graphic_height - graphic_margin.top - graphic_margin.bottom;

  var rects = d3.select("#" + graphic_div).selectAll(".treemap_g").selectAll("rect");
  var text = d3.select("#" + graphic_div).selectAll(".treemap_g").selectAll("text");

  rects.transition().duration(1000).style("opacity", "0");
  text.transition().duration(1000).style("opacity", "0");
  d3.select("#" + graphic_div).selectAll("#treemap_svg").transition().delay(1000).remove();
}