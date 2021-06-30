var resultText = document.querySelector('#result-text');
var resultContent = document.querySelector('#result-content');
var searchForm = document.querySelector('#search-form');

function getParams() {
  // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
  var searchParamsArr = document.location.search.split('&');

  // Get the query and format values
  var query = searchParamsArr[0].split('=').pop();
  var format = searchParamsArr[1].split('=').pop();

  searchApi(query, format);
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
    bodyContentEl.innerHTML =
      '<strong>Date:</strong> ' + resultObj.date + '<br/>';
      if (resultObj.description) {
        bodyContentEl.innerHTML +=
          '<strong>Description:</strong> ' + resultObj.description[0];
      } else {
        bodyContentEl.innerHTML +=
          '<strong>Description:</strong>  No description for this entry.';
      }
    
      var linkButton = document.createElement('a');
      linkButton.textContent = 'Read More';
      linkButton.setAttribute('href', resultObj.url);
      linkButton.classList.add('btn', 'btn-dark');
    
      resultBody.append(title, bodyContent, linkButton);
    
      resultContent.append(resultCard);
  
  }

  function searchApi(query, format) {
    var locQueryUrl = "https://api.openbrewerydb.org/breweries/search?query=dog";
  
    if (format) {
      locQueryUrl = "https://api.openbrewerydb.org/" + format + "?query=dog";
    }
  
    locQueryUrl = locQueryUrl + '&q=' + query;
  
    fetch(locQueryUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
  
        return response.json();
      })
      .then(function (locRes) {
        resultText.textContent = locRes.search.query;
  
        console.log(locRes);
  
        if (!locRes.results.length) {
          console.log('No results found!');
          resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
        } else {
          resultContentEl.textContent = '';
          for (var i = 0; i < locRes.results.length; i++) {
            printResults(locRes.results[i]);
          }
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  

  function handleSearchFormSubmit(event) {
    event.preventDefault();
  
    var searchInputVal = document.querySelector('#search-input').value;
    var formatInputVal = document.querySelector('#format-input').value;
  
    if (!searchInputVal) {
      console.error('You need a search input value!');
      return;
    }
  
    searchApi(searchInputVal, formatInputVal);
  }
  

  async function getBreweryData(region, regionType) {
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

        return data;
    });
};

searchForm.addEventListener('submit', handleSearchFormSubmit);

getParams();