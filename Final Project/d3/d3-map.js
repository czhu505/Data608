Plotly.d3.csv('https://raw.githubusercontent.com/czhu505/Data608/master/Final%20Project/data/perc_delay_city.csv', function(err, rows){
      function unpack(rows, key) {
          return rows.map(function(row) { return row[key]; });
      }
var cityName = unpack(rows, 'CITY'),
    cityDelay = unpack(rows, 'perc_delay'),
    cityLat = unpack(rows, 'LATITUDE'),
    cityLon = unpack(rows, 'LONGITUDE'),
    color = [,"rgb(255,65,54)","rgb(133,20,75)","rgb(255,133,27)","lightgrey"],
    citySize = [],
    hoverText = [],
    scale = 0.1;

for ( var i = 0 ; i < cityDelay.length; i++) {
  var currentSize = cityDelay[i] / scale;
  var currentText = cityName[i] + "<br>delay: " + cityDelay[i];
  citySize.push(currentSize);
  hoverText.push(currentText);
}

  var data = [{
   type: 'scattergeo',
   locationmode: 'USA-states',
   lat: cityLat,
   lon: cityLon,
   text: hoverText,
   hoverinfo: 'text',
   marker: {
     size: citySize,
     line: {
       color: 'black',
       width: 2
     },
     
   }
}];

var layout = {
    title: '2015 US Flight to City Delay Probability',
    showlegend: false,
    geo: {
      scope: 'usa',
      projection: {
        type: 'albers usa'
      },
      showland: true,
      landcolor: 'rgb(217, 217, 217)',
      subunitwidth: 1,
      countrywidth: 1,
      subunitcolor: 'rgb(255,255,255)',
      countrycolor: 'rgb(255,255,255)'
    },
};

Plotly.plot(myDiv, data, layout, {showLink: false, showSendToCloud: true});
  });