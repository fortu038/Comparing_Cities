var citySearches = JSON.parse(localStorage.getItem("cityNamesArray"));

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
    var country = data._links["city:country"].href;
    var urbanArea = data._links["city:urban_area"].href;
    getUA(urbanArea);
    // getCountry(country);
  });
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

function dynamicCard(){
  var cardDeck=$('.card-deck');

  var card=$('<div class=card>');
  var carImg=$('<img class=card-img-top>');
  var cardBody=$('<div class=card-body>');
  var cardTitle=$('<h5 class=card-title>');
  var cardText=$('<p class=card-text>');

  cardDeck.append(card);
  card.append(carImg,cardBody);
  cardBody.append(cardTitle,cardText);
}

for (var i = 0; i < citySearches.length; i++) {
  getCity(citySearches[i]);
  console.log(citySearches.length);
  dynamicCard();
}