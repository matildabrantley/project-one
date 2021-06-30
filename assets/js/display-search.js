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