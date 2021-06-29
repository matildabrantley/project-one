var wikiSection = $('<div></div>');

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

getWikiPage("California");

async function getCityBreweryData(city) {
    var url = "https://api.openbrewerydb.org/breweries?per_page=50?by_city=" + city;
    //return fetch Promise of city's brewery data
    return fetch(url)
    .then(function (response) {
        //console.log(response);
        return response.json();
    })
    .then(function (data) {
        console.log("City results");
        console.log(data);

        return data;
    });
};

getCityBreweryData("Atlanta");

async function getStateBreweryData(state) {
    var url = "https://api.openbrewerydb.org/breweries?per_page=50?by_state=" + state ;
    //return fetch Promise of state's brewery data
    return fetch(url)
    .then(function (response) {
        //console.log(response);
        return response.json();
    })
    .then(function (data) {
        console.log("State results");
        console.log(data);

        return data;
    });
};

getStateBreweryData("Georgia");