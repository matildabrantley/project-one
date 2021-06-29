var wikiSection = $('#wiki');
var breweryArray = [];
var searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', searchFormSubmit);

async function getWikiPage(page) {
    $.ajax({
        type: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + page + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: true,
        dataType: "json",
        success: function (data) {
            var wikiText = data.parse.text["*"];
            var pageSection = $('<div></div>').html(wikiText);
            wikiSection.html($(pageSection).find('*'));
        },
        error: function (error) {}
    });
    
    // var url = "https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=info&generator=search&inprop=url&gsrlimit=1&gsrsearch=" + page;
    // //return fetch Promise of Wiki page
    // return fetch(url)
    // .then(function (response) {
    //     //console.log(response);
    //     return response.json();
    // })
    // .then(function (data) {
    //     console.log(data.query.pages);

    //     $('#wiki').html(data);
    //     //return data.query.pages;
    // });
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
    .then(function (data) {
        console.log("Region results");
        console.log(data);

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