
var cityNamesArray = [];

// function getCity(city) {
//   fetch('https://api.teleport.org/api/cities/?search=' + city)

//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     var country = data._links["city:country"].href;
//     var urbanArea = data._links["city:urban_area"].href;
//     getUA(urbanArea);
//     // getCountry(country);
//   });
// }

// function getCity(city) {
//   fetch('https://api.teleport.org/api/cities/?search=' + city)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     var geo = data._embedded["city:search-results"][0]._links["city:item"].href;
//     getAPI(geo);
//   });
// }

// function getUA(UA) {
//   fetch(UA)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     // console.log(data);
//     var scores = data._links["ua:scores"].href;
//     var details = data._links["ua:details"].href;
//     var salaries = data._links["ua:salaries"].href;
//     getUAscores(scores);
//     getUAdetails(details);
//     getUAsalaries(salaries);
//   });
// }

// function getUAscores(scores) {
//   fetch(scores)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data);
//   });
// }

// function getUAdetails(details) {
//   fetch(details)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data);
//   });
// }

// function getUAsalaries(salaries) {
//   fetch(salaries)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data);
//   });
// }


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

// function checkForNumbers(string) {
//   return !isNaN(parseFloat(string)) && isFinite(string);
// }

// Helper function that checks for numbers in a given string
// @param str: The string that is being checked for numbers
// @return: True if the string contains a number, false if it does not contain a number
function checkForNumbers(str) {
  var regex = /\d/g;
  return regex.test(str);
} 

// Helper function that capitalizes the first letter of each word in a given string
// @param str: The string that is having the first letter of each of its words capitalized
// @return: A string which has each word capitalized
function capitalizeFirstLetter(str) {
  var splitHolder = str.split(" ");
  for(var i = 0; i < splitHolder.length; i++) {
    splitHolder[i] = splitHolder[i][0].toUpperCase() + splitHolder[i].substr(1);
  }

  return splitHolder.join(" ");
}

$("#search-button").on('click', function(event) {
  event.preventDefault();
  var trackerBool = false;
  cityNamesArray = [];
  for(var i = 1; i < 4; i++) {
    var valHolder = $(`#city-name-search-${i}`).val();
    // console.log(valHolder);
    var boolHolder = checkForNumbers(valHolder);
    // console.log(boolHolder);
    if(boolHolder) {
      trackerBool = true;
    }
    cityNamesArray.push(capitalizeFirstLetter(valHolder));
  }

  if(trackerBool) {
    alert("At least one of your entries contains numbers. Please re-enter city names");
  } else {
    // console.log("no numbers found");
    save();
    window.location.href = "index2.html";
  }
});

init();

