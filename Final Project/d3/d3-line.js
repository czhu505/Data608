/*
*    main.js
*    Data608 final D3.js
*    Modify from:
*    https://bl.ocks.org/jqadrad/a58719d82741b1642a2061c071ae2375
*   
*/

//chart 1 
// Draw a line chart

var svg = d3.select('svg'),
  margin = { top: 50, right: 50, bottom: 30, left: 50 },
  width = +svg.attr('width') - margin.left - margin.right,
  height = +svg.attr('height') - margin.top - margin.bottom,
  g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

 // Graph title
g.append('text')
  .attr('x', (width / 2))             
  .attr('y', 0 - (margin.top / 3))
  .attr('text-anchor', 'middle')  
  .style('font-size', '16px') 
  .text('2015 US Airline Arrival Delay in Minutes');
// Function to convert a string into a time
var parseTime = d3.time.format('%Y-%m').parse;

// Set the X scale
var x = d3.time.scale().range([15, width], 0.5);
// Set the Y scale
var y = d3.scale.linear().range([height, 0]);
// Set the color scale
var color = d3.scale.category10();

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left");

var line = d3.svg.line()
// .interpolate("basis")
.x(function(d) {
  return x(d.month);
})
.y(function(d) {
  return y(d.delay_min);
});
  
  // load the data
d3.json("data.json", function(error, data) {

  // Select the important columns
  color.domain(d3.keys(data[0]).filter(function(key) {
      return key !== "Time";
  }));

  // Correct the types
  data.forEach(function(d) {
    d.month = parseTime(d.Time);
  });
  console.log(data);

  var arr_delay_data = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {
          month: d.month,
          delay_min: +d[name]
        };
      })
    };
  });
  console.log(arr_delay_data)
  // Set the X domain
  x.domain(d3.extent(data, function(d) {
    return d.month;
  }));
  // Set the Y domain
  y.domain([
    d3.min(arr_delay_data, function(c) {
      return d3.min(c.values, function(v) {
        return v.delay_min;
      });
    }),
    d3.max(arr_delay_data, function(c) {
      return d3.max(c.values, function(v) {
        return v.delay_min;
      });
    })
  ]);
  // Set the X axis
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  // Set the Y axis
  g.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Arrival_Delay (Mins)");

  // Draw the lines
  var airline_data = g.selectAll(".airline_data")
    .data(arr_delay_data)
    .enter().append("g")
    .attr("class", "airline_data");

    airline_data.append("path")
    .attr("class", "line")
    .attr("d", function(d) {
      return line(d.values);
    })
    .style("stroke", function(d) {
      return color(d.name);
    });
  // Add the circles
  airline_data.append("g").selectAll("circle")
    .data(function(d){return d.values})
    .enter()
    .append("circle")
    .attr("r", 2)
    .attr("cx", function(dd){return x(dd.month)})
    .attr("cy", function(dd){return y(dd.delay_min)})
    .attr("fill", "none")
    .attr("stroke", function(d){return color(this.parentNode.__data__.name)});
  // Add label to the end of the line
  airline_data.append("text")
    .attr("class", "label")
    .datum(function (d) {
      return {
        name: d.name,
        value: d.values[d.values.length - 1]
      };
    })
    .attr("transform", function (d) {
      return "translate(" + x(d.value.month) + "," + y(d.value.delay_min) + ")";
    })
    .attr("x", 3)
    .attr("dy", ".35em")
    .text(function (d) {
      return d.name;
  });

// Add the mouse line
var mouseG = g.append("g")
  .attr("class", "mouse-over-effects");

mouseG.append("path")
  .attr("class", "mouse-line")
  .style("stroke", "black")
  .style("stroke-width", "1px")
  .style("opacity", "0");

var lines = document.getElementsByClassName('line');

var mousePerLine = mouseG.selectAll('.mouse-per-line')
  .data(arr_delay_data)
  .enter()
  .append("g")
  .attr("class", "mouse-per-line");

mousePerLine.append("circle")
  .attr("r", 7)
  .style("stroke", function (d) {
    return color(d.name);
  })
  .style("fill", "none")
  .style("stroke-width", "2px")
  .style("opacity", "0");

mousePerLine.append("text")
    .attr("class", "hover-text")
    .attr("dy", "-1em")
    .attr("transform", "translate(10,3)");

// Append a rect to catch mouse movements on canvas
mouseG.append('svg:rect') 
  .attr('width', width) 
  .attr('height', height)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on('mouseout', function () { 
    // on mouse out hide line, circles and text
    d3.select(".mouse-line")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "0");
  })
  .on('mouseover', function () { 
    // on mouse in show line, circles and text
    d3.select(".mouse-line")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "1");
  })
  .on('mousemove', function () { 
    // mouse moving over canvas
    var mouse = d3.mouse(this);

    d3.selectAll(".mouse-per-line")
      .attr("transform", function (d, i) {

        var xMonth= x.invert(mouse[0]),
          bisect = d3.bisector(function (d) { return d.month; }).left;
        idx = bisect(d.values, xMonth);

        d3.select(this).select('text')
          .text(y.invert(y(d.values[idx].delay_min)).toFixed(2));

        d3.select(".mouse-line")
          .attr("d", function () {
            var data = "M" + x(d.values[idx].month) + "," + height;
            data += " " + x(d.values[idx].month) + "," + 0;
            return data;
          });
        return "translate(" + x(d.values[idx].month) + "," + y(d.values[idx].delay_min) + ")";
      });
  });
    

})


