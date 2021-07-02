var searchForm = document.querySelector('#search-form');
var breweryList = $('#brewery-list');
var breweryArray = [];

searchForm.addEventListener('submit', searchFormSubmit);

getBreweryData(localStorage["indexSearchRegion"]);

async function getBreweryData(region) {
  var regionType = document.querySelector('#format-input').value;
  if (regionType != "state" && regionType != "city")
      regionType = "city";

  //split up string by ","
  var regionSubstrings = region.split(",");
  //if the resulting substring array is longer than 0, assume user is specifying the state the city's in
  if (regionSubstrings.length > 1) {
      region = regionSubstrings[0]; //discard the state for OpenBrewery DB
      regionType = "city";
      document.querySelector('#format-input').value = "city";
      console.log(region);
  }

  var url = "https://api.openbrewerydb.org/breweries?by_"+ regionType + "=" + region;
  //return fetch Promise of region's brewery data
  return fetch(url)
  .then(function (response) {
      return response.json();
  })
  .then(function (breweryData) {
      displayBreweries(breweryData, region)
      return breweryData;
  });
};

function displayBreweries(breweryData, region){
  //clears previous breweries on page except for original (used as prototype)
  $("#info-section").empty();
  for (var i = 0; i < breweryData.length; i++){
    var brewInfo = $("<article></article>"); 
      brewInfo.addClass("brew-info");

          //create & display name
      var breweryName = $("<h4>" + breweryData[i].name + "</h4>");
      brewInfo.append(breweryName);

      //create & display type (if it exists)
      if (breweryData[i].brewery_type != null) {
          var brewType = $("<p>Brew Type: " + capitalize(breweryData[i].brewery_type) + "</p>");
          brewInfo.append(brewType);
      }

      //create & display street (if it exists)
      if (breweryData[i].street != null) {
          var brewStreet = $("<p>Address: " + capitalize(breweryData[i].street) + "</p>");
          brewInfo.append(brewStreet);
      }

      //create & display city (if it exists)
      if (breweryData[i].city != null) {
          var brewCity = $("<p>City: " + capitalize(breweryData[i].city) + "</p>");
          brewInfo.append(brewCity);
      }

      //create & display state (if it exists)
      if (breweryData[i].state != null) {
          var brewState = $("<p>State: " + capitalize(breweryData[i].state) + "</p>");
          brewInfo.append(brewState);
      }

      //create & display phone number (if it exists)
      if (breweryData[i].phone != null) {
          var brewPhone = $("<p>Phone Number: " + breweryData[i].phone + "</p>");
          brewInfo.append(brewPhone);
      }

      //create & display link to website (if it exists)
      if (breweryData[i].website_url != null) {
          var breweryWebsite = $("<a>Website: " + breweryData[i].website_url + "</a>");
          breweryWebsite.attr("href", breweryData[i].website_url);
          breweryWebsite.css("color", "navyblue");
          brewInfo.append(breweryWebsite);
      }
      $("#info-section").append(brewInfo);
  }
}

//handles search event and triggers API connection
function searchFormSubmit(event) {
  event.preventDefault();

  var searchRegion = document.querySelector('#search-input').value;
  getBreweryData(searchRegion);
}

  function capitalize(word) {return word[0].toUpperCase() + word.slice(1);}