
Plotly.d3.csv('https://raw.githubusercontent.com/czhu505/Data608/master/Final%20Project/data/arr_delay_dest.csv', function(err, rows){

function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

var allAirlineNames = unpack(rows, 'AIRLINE'),
    allDest = unpack(rows, 'Distance'),
    allDelay = unpack(rows, 'ARRIVAL_DELAY'),
    listofAirlines = [],
    currentDelay = [],
    currentDest = [];

for (var i = 0; i < allAirlineNames.length; i++ ){
    if (listofAirlines.indexOf(allAirlineNames[i]) === -1 ){
    listofAirlines.push(allAirlineNames[i]);
    }
}

function getAirlineData(chosenAirline) {
    currentDelay = [];
    currentDest = [];
    for (var i = 0 ; i < allAirlineNames.length ; i++){
    if ( allAirlineNames[i] === chosenAirline ) {
        currentDelay.push(allDelay[i]);
        currentDest.push(allDest[i]);
    } 
    }
};

// Default Ariline Data
setBubblePlot('AA');

function setBubblePlot(chosenAirline) {
    getAirlineData(chosenAirline);  

    var trace1 = {
    x: currentDest,
    y: currentDelay,
    mode: 'lines+markers',
    marker: {
        size: 12, 
        opacity: 0.5
    }
    };

    var data = [trace1];

    var layout = {
    title: '2015 Airline Arrival Delay (Minutes) <br>vs Destance (Miles)'+' : ' +chosenAirline 
    };

    Plotly.newPlot('plotdiv', data, layout, {showSendToCloud: true});
};

var innerContainer = document.querySelector('[data-num="0"'),
    airlineSelector = innerContainer.querySelector('.airlinedata'),
    plotEl = innerContainer.querySelector('.plot');

function assignOptions(textArray, selector) {
    for (var i = 0; i < textArray.length;  i++) {
        var currentOption = document.createElement('option');
        currentOption.text = textArray[i];
        selector.appendChild(currentOption);
    }
}

assignOptions(listofAirlines, airlineSelector);

function updateAirline(){
    setBubblePlot(airlineSelector.value);
}

airlineSelector.addEventListener('change', updateAirline, false);
});