//Global Variables

var citySearches = JSON.parse(localStorage.getItem("cityNamesArray"));

var cardDeck;
var card;
var carImg;
var cardBody;
var cardTitle;
var cardItems;
var cityName;

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
    cityName = data.name;
    var cityPop = data.population;
    var country = data._links["city:country"].href;
    var urbanArea = data._links["city:urban_area"].href;
    getUA(urbanArea);
    createTopCard(cityName, cityPop);
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
    var salaries = data._links["ua:salaries"].href;
    getUAscores(scores);
    getUAdetails(details);
    getUAsalaries(salaries);
  });
}

function getUAscores(scores) {
  fetch(scores)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // console.log(data);
  });
}

function getUAdetails(details) {
  fetch(details)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    var cat = data.categories;
    var colInfo = cat[3].data;
    console.log(colInfo);
    for (var j = 1; j < colInfo.length; j++) {
      var label = colInfo[j].label;
      var cost = colInfo[j].currency_dollar_value;
      console.log(label);
      console.log(cost);
    }
    createSecondCard();
  });
}

function getUAsalaries(salaries) {
  fetch(salaries)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // console.log(data);
  });
}

// Functions to dynamically create the cards and append the cards to the desired info
function createTopCard(city, cityPop){
  cardDeck=$('.city-card-group');

  card=$("<div class='col-12 card border-info'>");
  carImg=$('<img class=card-img-top>');
  cardBody=$("<div class='card-body text-info'>");
  cardTitle=$("<h5 class='card-title text-info'>");
  cardItems=$('<p>');

  cardTitle.text(city)
  cardItems.text("Population: " + cityPop)
  cardDeck.append(card);
  card.append(carImg,cardBody);
  cardBody.append(cardTitle, cardItems);
}

function createSecondCard(){
  cardDeck=$('.ua-card-group');

  card=$("<div class='col-12 card'>");
  cardBody=$('<div class=card-body>');
  cardTitle=$('<h5 class=card-title>');
  cardItems=$('<p>');

  cardDeck.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, cardItems);
  cardBody.append(cardItems);
  
}

for (var i = 0; i < citySearches.length; i++) {
  getCity(citySearches[i]);
}

//chart

var chart = c3.generate({
  data: {
      x : 'x',
      columns: [
          ['x', citySearches[0], citySearches[1], citySearches[2]],
          ['download', 30, 200, 100, 400],
          ['loading', 90, 100, 140, 200],
      ],
      groups: [
          ['download', 'loading']
      ],
      type: 'bar'
  },
  axis: {
      x: {
          type: 'category' // this needed to load string x value
      }
  }
});
