
var cityNamesArray = [];

// Helper function that initializes cityNamesArray from local storage, setting it to [] if it does not exist
// in local storage or to the value in local storage if it exists. Also autofills the search boxes with the
// values from local storage if they exist
function init() {
  var holder = JSON.parse(localStorage.getItem("cityNamesArray"));

  if(holder === null) {
    cityNamesArray = [];
  } else {
    cityNamesArray = holder;
    for(var i = 0; i < cityNamesArray.length; i++) {
      $(`#city-name-search-${i+1}`).val(cityNamesArray[i]);
    }
  }
  save();
}

// Helper function that saves cityNamesArray to local storage
function save() {
  localStorage.setItem("cityNamesArray", JSON.stringify(cityNamesArray));
}

// Helper function that checks for numbers in a given string
// @param str: The string that is being checked for numbers
// @return: True if the string contains a number, false if it does not contain a number
function checkForNumbers(str) {
  var regex = /\d/g;
  return regex.test(str);
} 

// Helper function that capitalizes the first letter of each word in a given string
// @param str: The string that is having the first letter of each of its words capitalized
// @return: A string which has each word's first letter capitalized
function capitalizeFirstLetter(str) {
  var splitHolder = str.split(" ");
  for(var i = 0; i < splitHolder.length; i++) {
    splitHolder[i] = splitHolder[i][0].toUpperCase() + splitHolder[i].substr(1);
  }

  return splitHolder.join(" ");
}

// Helper function that checks to see if a given string is composed entirely of spaces
// @param str: The string that is being checked
// @return: True if the given string is entirely composed of spaces, false if it is not
function isJustSpaces(str) {
  var trackerBool = true;
  for(var i = 0; i < str.length; i++) {
    if(str[i] != " ") {
      trackerBool = false;
      break;
    }
  }

  return trackerBool;
}

// Event listener for the search button
$("#search-button").on('click', function(event) {
  event.preventDefault();
  var numTrackerBool = false;
  var blankTrackerBool = false;
  cityNamesArray = [];
  for(var i = 1; i < 4; i++) {
    var valHolder = $(`#city-name-search-${i}`).val();
    if(checkForNumbers(valHolder)) {
      numTrackerBool = true;
    } else if((valHolder[0] == " ") || (valHolder.length == 0) || isJustSpaces(valHolder)) {
      blankTrackerBool = true;
    } else {
      cityNamesArray.push(capitalizeFirstLetter(valHolder));
    }

  }

  if(numTrackerBool) {
    swal("At least one of your entries contains numbers. Please re-enter city names.");
  } else if(blankTrackerBool) {
    swal("At least one of your options is blank. If you'd like to add another city you can type it here", {
      content: "input",
      icon: "warning",
      buttons: ["Continue without adding", "add"],
    })
    .then((value) => {
      swal(`you typed: ${value}`);
      cityNamesArray.push(value)
      save();
      window.location.href = "index2.html";
    });
  } else {
    save();
    window.location.href = "index2.html";
  }
});

init();