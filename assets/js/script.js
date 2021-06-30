var wikiContainer = $('#wiki');
var wikiImages = $('#wiki-images');
var wikiParagraphs = $('#wiki-paragraphs');
var topTenContainer = $('#top-ten');
var breweryArray = [];
var searchForm = document.querySelector('#search-form');

searchForm.addEventListener('submit', searchFormSubmit);

async function getWikiPage(page) {
    $.ajax({
        type: "GET",
        url: "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + page + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: true,
        dataType: "json",
        success: function (data) {
            var wikiContainer = data.parse.text["*"];
            var pageSection = $('<div></div>').html(wikiContainer);
            wikiImages.html($(pageSection).find('img').eq(0));
            wikiParagraphs.html($(pageSection).find('p').slice(0,3));
        },
        error: function (error) {}
    });
};

getWikiPage("Atlanta");

async function getBreweryData(region, regionType) {
    var url = "https://api.openbrewerydb.org/breweries?by_"+ regionType + "=" + region;
    //return fetch Promise of region's brewery data
    return fetch(url)
    .then(function (response) {
        //console.log(response);
        return response.json();
    })
    .then(function (breweryData) {
        console.log("Region results");
        console.log(breweryData);

       // displayBreweries(breweryData)
        return data;
    });
};

// function displayBreweries(breweryData){
//     //clears previous breweries on page except for original (used as prototype)
//     while (topTenContainer.children().eq(1))
//         topTenContainer.remove(topTenContainer.children().eq(1));
//     for (var i = 0; i < breweryData.length; i++){
//         var brewery = $('#brewery').clone();
//         brewery.css("display", "inline-block");
//         brewery.text(breweryData[i].name)
//         topTenContainer.append(brewery);  
//     }
// }

function searchFormSubmit(event) {
    event.preventDefault();

    var searchRegion = document.querySelector('#search-input').value;
    var regionType = document.querySelector('#format-input').value;
    getBreweryData(searchRegion, regionType);
    getWikiPage(searchRegion);
  }