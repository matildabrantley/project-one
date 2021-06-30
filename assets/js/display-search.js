var resultText = document.querySelector('#result-text');
var resultContent = document.querySelector('#result-content');
var searchForm = document.querySelector('#search-form');

searchForm.addEventListener('submit', searchFormSubmit);



  async function getBreweryData(region, regionType) {
    var url = "https://api.openbrewerydb.org/breweries?by_"+ regionType + "=" + region;
    //return fetch Promise of region's brewery data
    return fetch(url)
    .then(function (response) {
        console.log(response);
        return response.json();
    })
    .then(function (data) {
        console.log("Region results");
        console.log(data);

        printResults(data);

        return data;
    });
};

function searchFormSubmit(event) {
    event.preventDefault();

    var searchRegion = document.querySelector('#search-input').value;
    var regionType = document.querySelector('#format-input').value;
    getBreweryData(searchRegion, regionType);
    getWikiPage(searchRegion);
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