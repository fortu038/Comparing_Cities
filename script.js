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
    console.log(data);
  });
}

function getUAdetails(details) {
  fetch(details)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
}

function getUAsalaries(salaries) {
  fetch(salaries)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
}

$("#search-button").on('click', function(event) {
  event.preventDefault();
  var city = $('#city-name-search').val();
  getCity(city);
});