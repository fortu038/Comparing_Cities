//Global Variables

var citySearches = JSON.parse(localStorage.getItem("cityNamesArray"));

var cardDeck;
var card;
var carImg;
var cardBody;
var cardTitle;
var cardItems;

// Functions to navigate through API and get the proper data

function getCity(city) {
  cardTitle.text(city);
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
    console.log(data);
    var cityPop = data.population;
    var country = data._links["city:country"].href;
    var urbanArea = data._links["city:urban_area"].href;
    getUA(urbanArea);
    displayPopulation(cityPop);
  });
}

function displayPopulation(Pop) {
  cardItems.text("Population: " + Pop)
}

function getUA(UA) {
  fetch(UA)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // console.log(data);
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
    // console.log(data);
    // var cat = data.categories;
    // var citySize = cat[1].data[0].float_value;
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
function createCard(){
  cardDeck=$('.card-deck');

  card=$('<div class=card>');
  carImg=$('<img class=card-img-top>');
  cardBody=$('<div class=card-body>');
  cardTitle=$('<h5 class=card-title>');
  cardItems=$('<p>');
  cardDeck.append(card);
  card.append(carImg,cardBody);
  cardBody.append(cardTitle, cardItems);
  
}

// function createTitleEl() {
//   var title = 
// }

for (var i = 0; i < citySearches.length; i++) {
  createCard();
  getCity(citySearches[i]);
}