var resultText = document.querySelector('#result-text');
var resultContent = document.querySelector('#result-content');
var searchForm = document.querySelector('#search-form');
var breweryList = $('#brewery-list');
var breweryArray = [];

searchForm.addEventListener('submit', searchFormSubmit);



async function getBreweryData(region) {
  var regionType = document.querySelector('#format-input').value;
  if (regionType != "state" && regionType != "city")
      regionType = "city";

  var url = "https://api.openbrewerydb.org/breweries?by_"+ regionType + "=" + region;
  //return fetch Promise of region's brewery data
  return fetch(url)
  .then(function (response) {
      //console.log(response);
      return response.json();
  })
  .then(function (data) {
      console.log("Region results");
      console.log(data);

     displayBreweries(data, region)
      return data;
  });
};

function displayBreweries(data, region){
  //clears previous breweries on page except for original (used as prototype)
  breweryList.empty();
  for (var i = 0; i < data.length; i++){
      var breweryTitle = $(document.createElement("a"));
      breweryTitle.attr("href", "#brew-info");
      breweryTitle.attr("name", data[i].name);
      breweryTitle.brewPhone = data[i].phone;
      breweryTitle.brewWebsite = data[i].website_url;
      breweryTitle.brewStreet = data[i].street;
      breweryTitle.text(data[i].name);
      breweryTitle.css("display", "inline-block");
      breweryTitle.addClass("brewery-title");
      $('#list-header').css("display", "block");
      breweryTitle.on("click", 
          {brewPhone: data[i].phone, brewWebsite: data[i].website_url, brewStreet: data[i].street,
              brewType: data[i].brewery_type, brewState: data[i].state, brewCity: data[i].city}, 
          displayBreweryInfo);
        
      breweryList.append(breweryTitle);  
  }
}

function displayBreweryInfo (e) {
  brewInfo = $("#brew-info");
  //clear anything in info box
  brewInfo.empty();
  $('.grid-container').css("grid-template-columns", "1fr 1fr 1fr");
  brewInfo.css("background-color", "rgba(0,0,0,.60)");
  brewInfo.css("display", "block");

  //create & display name
  var breweryName = $("<h4>" + this.name + "</h4>");
  breweryName.css("color", "white");
  brewInfo.append(breweryName);

  //create & display type (if it exists)
  if (e.data.brewType != null) {
      var brewType = $("<p>Brew Type: " + capitalize(e.data.brewType) + "</p>");
      brewType.css("color", "white");
      brewInfo.append(brewType);
  }

  //create & display street (if it exists)
  if (e.data.brewStreet != null) {
      var brewStreet = $("<p>Address: " + capitalize(e.data.brewStreet) + "</p>");
      brewStreet.css("color", "white");
      brewInfo.append(brewStreet);
  }

  //create & display city (if it exists)
  if (e.data.brewCity != null) {
      var brewCity = $("<p>City: " + capitalize(e.data.brewCity) + "</p>");
      brewCity.css("color", "white");
      brewInfo.append(brewCity);
  }

  //create & display state (if it exists)
  if (e.data.brewState != null) {
      var brewState = $("<p>State: " + capitalize(e.data.brewState) + "</p>");
      brewState.css("color", "white");
      brewInfo.append(brewState);
  }

  //create & display phone number (if it exists)
  if (e.data.brewPhone != null) {
      var brewPhone = $("<p>Phone Number: " + e.data.brewPhone + "</p>");
      brewPhone.css("color", "white");
      brewInfo.append(brewPhone);
  }

  //create & display link to website (if it exists)
  if (e.data.brewWebsite != null) {
      var breweryWebsite = $("<a>Website: " + e.data.brewWebsite + "</a>");
      breweryWebsite.attr("href", e.data.brewWebsite);
      breweryWebsite.css("color", "cyan");
      brewInfo.append(breweryWebsite);
  }

  //put up a different brewery picture
  $('#brew-pic').css("display", "block");
  var brewPic = $('#brew-pic').find("img");
  switch(Math.floor(Math.random()*8)){
      case 0:
          brewPic.attr("src", "../assets/images/brewery-background.jpg");
          break;
      case 1:
          brewPic.attr("src", "../assets/images/buncha-beer.jpeg");
          break;
      case 2:
          brewPic.attr("src", "../assets/images/beer-shelf.jpg");
          break;
      case 3:
          brewPic.attr("src", "../assets/images/stout-porter.jpeg");
          break;
      case 4:
          brewPic.attr("src", "../assets/images/cozy-pub.jpg");
          break;
      case 5:
          brewPic.attr("src", "../assets/images/kitahara-santana.jpg");
           break;
      case 6:
          brewPic.attr("src", "../assets/images/distillery.jpg");
          break;
      case 7:
          brewPic.attr("src", "../assets/images/conveyor-belt-brewery.jpg");
          break;
      default:
          brewPic.attr("src", "../assets/images/buncha-beer.jpeg");
  }
}

function searchFormSubmit(event) {
    event.preventDefault();

    var searchRegion = document.querySelector('#search-input').value;
    var regionType = document.querySelector('#format-input').value;
    getBreweryData(searchRegion, regionType);
  }

  function printResults(resultObj) {
    console.log(resultObj);
  
    // set up `<div>` to hold result content
    var resultCard = document.createElement('div');
    resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');
  
    var resultBody = document.createElement('div');
    resultBody.classList.add('card-body');
    resultCard.append(resultBody);
  
    var title = document.createElement('h3');
    title.textContent = resultObj.title;
  
    var bodyContent = document.createElement('p');
    bodyContent.innerHTML =
      '<strong>Date:</strong> ' + resultObj.date + '<br/>';
      if (resultObj.description) {
        bodyContent.innerHTML +=
          '<strong>Description:</strong> ' + resultObj.description[0];
      } else {
        bodyContent.innerHTML +=
          '<strong>Description:</strong>  No description for this entry.';
      }
    
      var linkButton = document.createElement('a');
      linkButton.textContent = 'Read More';
      linkButton.setAttribute('href', resultObj.url);
      linkButton.classList.add('btn', 'btn-dark');
    
      resultBody.append(title, bodyContent, linkButton);
    
      resultContent.append(resultCard);
  
    }
  