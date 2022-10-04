//Global Variables

var citySearches = JSON.parse(localStorage.getItem("cityNamesArray"));

var cardDeck;
var card;
var carImg;
var cardBody;
var cardTitle;
var cardItems;
var cityName;
var cityPop;
var image;
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
    getUAImages(images);
    getUAdetails(details, cityName);
    getUAscores(scores, cityName);
  });
}

function getUAImages(images) {
  fetch(images)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    image = data.photos[0].image.web
  });
}

function getUAscores(scores, cityName) {
  fetch(scores)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    createGraph(data, cityName);
  });
}

function getUAdetails(details, UAname) {
  fetch(details)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var colInfo = data.categories.find(x => x.id == "COST-OF-LIVING").data;
    var rentInfo = data.categories.find(x => x.id == "HOUSING").data;
    var climateInfo = data.categories.find(x => x.id == "CLIMATE")?.data;
    var popSize = data.categories.find(x => x.id == "CITY-SIZE").data[0].float_value;
    createTopCard(UAname);
    createSecondCard(colInfo, rentInfo, climateInfo, popSize);
  });

}

// Functions to dynamically create the cards and append the cards to the desired info
function createTopCard(UA){
  cardDeck=$('.city-card-group');

  card=$("<div class='col-12 card border-dark'>");
  carImg=$('<img class=card-img-top>');
  cardBody=$("<div class='card-body '>");
  cardTitle=$("<h3 class='card-title '>");

  carImg.attr("src", image);
  cardTitle.text(UA)
  cardDeck.append(card);
  card.append(carImg,cardBody);
  cardBody.append(cardTitle);
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
  cardItems=$('<p>').text(popInfo + " million");
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
      var cost = colInfo[i].currency_dollar_value;
      var label = colInfo[i].label;
      cardItems=$('<p>');
      cardItems.text(label + ": $" + cost);
      cardBody.append(cardItems)
    }
    for (var i=0; i<rentInfo.length-1; i++) {
      var cost = rentInfo[i].currency_dollar_value;
      var label = rentInfo[i].label;
      cardItems=$('<p>');
      cardItems.text(label + ": $" + cost + "/monthly");
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
        value = climateInfo[i].percent_value;
      }
      if (value == null) {
        value = climateInfo[i].string_value;
      }
      cardItems=$('<p>');
      cardItems.text(label + ": " + value);
      cardBody.append(cardItems);
    }
  }
};

// Functions to create a graph with desired info
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
      columns: [
        ['x', cityName],
        [scores.categories[0].name, scores.categories[0].score_out_of_10],
        [scores.categories[1].name, scores.categories[1].score_out_of_10],
        [scores.categories[2].name, scores.categories[2].score_out_of_10],
        [scores.categories[3].name, scores.categories[3].score_out_of_10],
        [scores.categories[4].name, scores.categories[4].score_out_of_10],
        [scores.categories[5].name, scores.categories[5].score_out_of_10],
        [scores.categories[6].name, scores.categories[6].score_out_of_10],
        [scores.categories[7].name, scores.categories[7].score_out_of_10],
        [scores.categories[8].name, scores.categories[8].score_out_of_10],
        [scores.categories[9].name, scores.categories[9].score_out_of_10],
        [scores.categories[10].name, scores.categories[10].score_out_of_10],
        [scores.categories[11].name, scores.categories[11].score_out_of_10],
        [scores.categories[12].name, scores.categories[12].score_out_of_10],
        [scores.categories[13].name, scores.categories[13].score_out_of_10],
        [scores.categories[14].name, scores.categories[14].score_out_of_10],
        [scores.categories[15].name, scores.categories[15].score_out_of_10],
        [scores.categories[16].name, scores.categories[16].score_out_of_10],
      ],
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