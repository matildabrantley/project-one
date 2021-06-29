async function getWikiData(page) {
    var url = "https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=5&gsrsearch=" + page;
    //return fetch Promise of Wiki page
    return fetch(url)
    .then(function (response) {
        //console.log(response);
        return response.json();
    })
    .then(function (data) {
        console.log(data.query.pages);

        return data.query.pages;
    });
};

getWikiData("California");

async function getCityBreweryData(city) {
    var url = "https://api.openbrewerydb.org/breweries?by_city=" + city;
    //return fetch Promise of city's brewery data
    return fetch(url)
    .then(function (response) {
        //console.log(response);
        return response.json();
    })
    .then(function (data) {
        console.log(data);

        return data;
    });
};

getCityBreweryData("Atlanta");

async function getStateBreweryData(state) {
    var url = "https://api.openbrewerydb.org/breweries?by_city=" + state;
    //return fetch Promise of state's brewery data
    return fetch(url)
    .then(function (response) {
        //console.log(response);
        return response.json();
    })
    .then(function (data) {
        console.log(data);

        return data;
    });
};

getCityBreweryData("Georgia");