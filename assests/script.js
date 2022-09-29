var cityNamesArray = [];

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

// Helper function that initializes cityNamesArray from local storage, setting it to [] if it does not exist
// in local storage or to the value in local storage if it exists
function init() {
  var holder = JSON.parse(localStorage.getItem("cityNamesArray"));

  if(holder === null) {
    cityNamesArray = [];
  } else {
    cityNamesArray = holder;
  }
  save();
}

// Helper function that saves cityNamesArray to local storage
function save() {
  localStorage.setItem("cityNamesArray", JSON.stringify(cityNamesArray));
}

$("#search-button").on('click', function(event) {
  event.preventDefault();
  // var city = $('#city-name-search').val();
  // var city = "chicago";
  // getCity(city);
  cityNamesArray = [];
  for(var i = 1; i < 4; i++) {
    console.log($(`#city-name-search-${i}`).val());
    cityNamesArray.push($(`#city-name-search-${i}`).val());
  }
  save();
});

init();