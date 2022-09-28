function getAPI(city) {
  fetch(city)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
}

function getCity(city) {
  fetch('https://api.teleport.org/api/cities/?search=' + city)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var geo = data._embedded["city:search-results"][0]._links["city:item"].href
    getAPI(geo);
  });
}


$('#submitBtn').on('click', function(event) {
  event.preventDefault();
  var city = $('#searchInput').val();
  getCity(city);
});