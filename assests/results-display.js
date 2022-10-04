//Global Variables

const currency = Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'USD',
});

const currencyCommaless = Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const threeDigitFormat = Intl.NumberFormat('en', {maximumSignificantDigits: 3});

const percentFormat = Intl.NumberFormat('en', {style: 'percent'});

const baseNumberFormat = Intl.NumberFormat('en', {style: 'decimal'});

var citySearches = JSON.parse(localStorage.getItem("cityNamesArray"));

var cardDeck;
var card;
var carImg;
var cardBody;
var cardTitle;
var cardItems;
var cityName;
var cityPop;
// Functions to navigate through API and get the proper data

function getCity(city) {
  fetch('https://api.teleport.org/api/cities/?search=' + city)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var geo = data._embedded["city:search-results"][0]._links["city:item"].href;
    getAPI(geo);
  });
}

function getAPI(city) {
  fetch(city)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var urbanArea = data._links["city:urban_area"].href;
    getUA(urbanArea);
  });
}

function getUA(UA) {
  fetch(UA)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var scores = data._links["ua:scores"].href;
    var details = data._links["ua:details"].href;
    var images = data._links["ua:images"].href
    var cityName = data.full_name;
    getUAImages(images, details, cityName);
    getUAscores(scores, cityName);
  });
}

function getUAImages(images, details, cityName) {
  fetch(images)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var cityImage = data.photos[0].image.web
    getUAdetails(details, cityName, cityImage);
  });
}

function getUAscores(scores, cityName) {
  fetch(scores)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    createColumns(data, cityName);
    createGraph(data, cityName);
  });
}

function getUAdetails(details, UAname, image) {
  fetch(details)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var colInfo = data.categories.find(x => x.id == "COST-OF-LIVING").data;
    var rentInfo = data.categories.find(x => x.id == "HOUSING").data;
    var climateInfo = data.categories.find(x => x.id == "CLIMATE")?.data;
    var popSize = data.categories.find(x => x.id == "CITY-SIZE").data[0].float_value;
    createTopCard(UAname, image);
    createSecondCard(colInfo, rentInfo, climateInfo, popSize);
  });
}

// Functions to dynamically create the cards and append the cards to the desired info
function createTopCard(UA, image){
  cardDeck=$('.city-card-group');

  card=$("<div class='col-12 card border-dark'>");
  carImg=$('<img class=card-img-top>');
  cardBody=$("<div class='card-body '>");
  cardTitle=$("<h3 class='card-title '>");

  cardTitle.text(UA);
  cardDeck.append(card);
  card.append(carImg,cardBody);
  cardBody.append(cardTitle);
  carImg.attr("src", image);
}

function createSecondCard(colInfo, rentInfo, climateInfo, popInfo){
  cardDeck=$('.ua-card-group');
  
  card=$("<div class='col-12 card'>");
  cardBody=$('<div class=card-body>');
  cardTitle=$('<h5 class=card-title>');
  cardDeck.append(card);
  card.append(cardBody);

  cardTitle.text("Urban Area Population");
  cardBody.append(cardTitle);
  cardItems=$('<p>').text(threeDigitFormat.format(popInfo) + " million");
  cardBody.append(cardItems);
  
  cardTitle=$('<h5 class=card-title>');
  cardTitle.text("Cost of Living");
  
  cardBody.append(cardTitle);

  if (colInfo == null) {
    cardItems=$('<p>');
    cardItems.text("No Data Available");
    cardBody.append(cardItems);
  } else {
    for (var i=1; i<colInfo.length; i++) {
      var cost = currency.format(colInfo[i].currency_dollar_value);
      var label = colInfo[i].label;
      cardItems=$('<p>');
      cardItems.text(label + ": " + cost);
      cardBody.append(cardItems)
    }
    for (var i=0; i<rentInfo.length-1; i++) {
      var cost = rentInfo[i].currency_dollar_value;
      var label = rentInfo[i].label;
      cardItems=$('<p>');
      cardItems.text(label + ": " + currencyCommaless.format(cost) + "/monthly");
      cardBody.append(cardItems)
    }
  }

  cardTitle=$('<h5 class=card-title>');
  cardTitle.text("Climate");
  cardBody.append(cardTitle);

  if (climateInfo == null) {
    cardItems=$('<p>');
    cardItems.text("No Data Available");
    cardBody.append(cardItems);
  } else {
    for (var i=0; i<climateInfo.length; i++) {
      var value = climateInfo[i].float_value;
      var label = climateInfo[i].label;
      if (value == null) {
        value = climateInfo[i].string_value;
      }
      if (value == null) {
        value = percentFormat.format(climateInfo[i].percent_value);
      }
      cardItems=$('<p>');
      cardItems.text(label + ": " + value);
      cardBody.append(cardItems);
    }
  }
};

// Functions to create a graph with desired info
function createColumns(scores, cityName) {
  var chartColumns = [];
  chartColumns.push(['x', cityName])
  for(let i = 0; i<17; i++) {
    chartColumns.push([scores.categories[i].name, threeDigitFormat.format(scores.categories[i].score_out_of_10)]);
  }
  return chartColumns;
}

function createGraph (scores, cityName) {
  var chartName = "A" + Math.random().toString(36).substring(2,7);
  var chartsDiv = $('#charts-container');
  var newChartContainer = $('<div id="' + chartName + '"/>');
  var chartTitleEl = $('<h4>')
  var chartTitle = "Transport API Scores Chart";
  chartTitleEl.text(chartTitle);
  chartsDiv.append(chartTitleEl);
  chartsDiv.append(newChartContainer);

  c3.generate({
    bindto: '#' + chartName,
    data: {
      x : 'x',
      columns: createColumns(scores, cityName),
      type: 'bar'
    },
    axis: {
      x: {
        type: 'category'
      },
      y: {
        max: 9.1
      },
    }
  });
}
// Function to get API information on load of second page

for (var i = 0; i < citySearches.length; i++) {
  getCity(citySearches[i]);
}