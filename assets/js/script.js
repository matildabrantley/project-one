var wiki = $('#wiki');
var wikiImages = $('#wiki-images');
var wikiParagraphs = $('#wiki-paragraphs');
var breweryList = $('#brewery-list');
var breweryArray = [];
var searchForm = document.querySelector('#search-form');

searchForm.addEventListener('submit', searchFormSubmit);

displayStoredSearches();

async function getWikiPage(page) {
    var regionType = document.querySelector('#format-input').value;
    //resolving as many ambiguities as possible
    page = resolveWikiAmbiguity(page);
    console.log(page);

    //ajax function to access wiki API to retireve first few paragraphs and first image
    $.ajax({
        type: "GET",
        //create url from parameters
        url: "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + page + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: true,
        dataType: "json",
        success: function (data) {
            console.log("Wiki results");
            console.log(data);
            var wikiContainer = data.parse.text["*"];
            var pageSection = $('<div></div>').html(wikiContainer);
            wikiImages.html($(pageSection).find('img').eq(0));
            wikiParagraphs.html($(pageSection).find('p').slice(0,4));
        },
        error: function (error) {}
    });
};

function getBreweryData(region) {
    var regionType = document.querySelector('#format-input').value;
    if (regionType != "state" && regionType != "city")
        regionType = "city";

    //split up string by ","
    var regionSubstrings = region.split(",");
    console.log(regionSubstrings);
    //if the resulting substring array is longer than 0, assume user is specifying the state the city's in
    if (regionSubstrings.length > 1) {
        region = regionSubstrings[0]; //discard the state for OpenBrewery DB
        regionType = "city";
        document.querySelector('#format-input').value = "city";
        console.log(region);
    }

    //create url from parameters
    var url = "https://api.openbrewerydb.org/breweries?by_"+ regionType + "=" + region;
    
    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (breweryData) {
       displayBreweries(breweryData, region)
    });
};

function displayBreweries(breweryData, region){
    //clears previous breweries on page except for original (used as prototype)
    breweryList.empty();
    for (var i = 0; i < breweryData.length; i++){
        var breweryTitle = $(document.createElement("a"));
        breweryTitle.attr("href", "#brew-pic");
        breweryTitle.attr("name", breweryData[i].name);
        breweryTitle.brewPhone = breweryData[i].phone;
        breweryTitle.brewWebsite = breweryData[i].website_url;
        breweryTitle.brewStreet = breweryData[i].street;
        breweryTitle.text(breweryData[i].name);
        breweryTitle.css("display", "inline-block");
        breweryTitle.addClass("brewery-title");
        $('#list-header').css("display", "block");
        $('#wiki').css("display", "block");
        breweryTitle.on("click", 
            {brewPhone: breweryData[i].phone, brewWebsite: breweryData[i].website_url, brewStreet: breweryData[i].street,
                brewType: breweryData[i].brewery_type, brewState: breweryData[i].state, brewCity: breweryData[i].city}, 
            displayBreweryInfo);
          
        breweryList.append(breweryTitle);  
    }

    if (!getStoredSearches().includes(region))
        addStoredSearch(region);

    if ($('#details-button').length == 0){
        var detailedResults = $(document.createElement("button"));
        detailedResults.attr("id", "details-button");
        detailedResults.text("Full Search Details");
        detailedResults.on("click", function(){
            location.assign("./search-results.html");
        });
        $('#full-results').append(detailedResults);
    }

    $('.grid-container').css("grid-template-columns", "0fr 1fr 1fr");
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
            brewPic.attr("src", "/project-one/assets/images/brewery-background.jpg");
            break;
        case 1:
            brewPic.attr("src", "/project-one/assets/images/buncha-beer.jpeg");
            break;
        case 2:
            brewPic.attr("src", "/project-one/assets/images/beer-shelf.jpg");
            break;
        case 3:
            brewPic.attr("src", "/project-one/assets/images/stout-porter.jpeg");
            break;
        case 4:
            brewPic.attr("src", "/project-one/assets/images/cozy-pub.jpg");
            break;
        case 5:
            brewPic.attr("src", "/project-one/assets/images/kitahara-santana.jpg");
             break;
        case 6:
            brewPic.attr("src", "/project-one/assets/images/distillery.jpg");
            break;
        case 7:
            brewPic.attr("src", "/project-one/assets/images/conveyor-belt-brewery.jpg");
            break;
        default:
            brewPic.attr("src", "/project-one/assets/images/buncha-beer.jpeg");
    }
}

  //retrieve localStorage storedSearches array and push to it, then append button
function addStoredSearch(search){
    var storedSearchesArray = getStoredSearches(); //get stored searches from localStorage
    //push new item to local array
    storedSearchesArray.push(search);
    //set localStorage to updated array
    localStorage.setItem("storedSearches", JSON.stringify(storedSearchesArray));
    //now add button to search history
    var storedSearch = $(document.createElement("button"));
    storedSearch.text(search);
    storedSearch.addClass('btn btn-info btn-block history-button');
    storedSearch.on('click', function(){
        getBreweryData(this.innerHTML);
        getWikiPage(this.innerHTML);
    });
    $('#search').append(storedSearch);
}

function getStoredSearches() {
    //if first search in search history
    if (localStorage.getItem("storedSearches") === null)
         localStorage.setItem("storedSearches", JSON.stringify(new Array()));
     return JSON.parse(localStorage.getItem("storedSearches"));
}

//displays searches from previous page visits in localStorage
function displayStoredSearches() {
    var storedSearchesArray = getStoredSearches();
    for (i in storedSearchesArray){
        var storedSearch = $(document.createElement("button"));
        storedSearch.text(storedSearchesArray[i]);
        storedSearch.addClass('btn btn-info btn-block history-button');
        storedSearch.on('click', function(){
            document.querySelector('#search-input').value = this.innerHTML;
            getBreweryData(this.innerHTML);
            getWikiPage(this.innerHTML);
        });
        $('#search').append(storedSearch);
    }
}

//handles search event and triggers API connection
function searchFormSubmit(event) {
    event.preventDefault();

    var searchRegion = document.querySelector('#search-input').value;
    var regionType = document.querySelector('#format-input').value;
    getBreweryData(searchRegion);
    getWikiPage(searchRegion);

    //set localStorage for search-results.html to retrieve
    localStorage.setItem("indexSearchRegion", searchRegion);
    localStorage.setItem("indexRegionType", searchRegion);
}

// wikipedia searches lead to many ambiguities, so this resolves
// many of the major cases that users would frequently encounter
// (not entirely feasible to programmatically deal with all possible cases)
function resolveWikiAmbiguity(page) {
    page = capitalize(page);
    
    //state ambiguities
    if (page == "Georgia")
        page += " (U.S. state)";
    if (page == "Washington")
        page += " (state)";
    if (page == "New York State")
        page = "New York (state)";

    //major city ambiguities
    if (page == "New York")
        if (document.querySelector('#format-input').value == "state") {
            page += " (state)";
        } else //defaults to NY City if state isn't specified
            page += " City"
    if (page == "San Jose" || page == "Sacramento" || page == "Fresno")
        page += ", California";
    if (page == "Memphis" || page == "Chattanooga")
        page += ", Tennessee";
    if (page == "Portland" || page == "Salem")
        page += ", Oregon";
    if (page == "El Paso" || page == "Fort Worth")
        page += ", Texas";
    if (page == "Louisville" || page == "Lexington")
        page += ", Kentucky";
    if (page == "Albuquerque" || page == "Santa Fe")
        page += ", New Mexico";
    if (page == "Tuscon" || page == "Phoenix")
        page += ", Arizona";
    if (page == "Tulsa")
        page += ", Oklahoma";
    if (page == "Charlotte" || page == "Raleigh")
        page += ", North Carolina";
    if (page == "Tampa" || page == "Orlando" || page == "Jacksonville")
        page += ", Florida";

    return page;
}

//makes first letter of string capital
function capitalize(word) {return word[0].toUpperCase() + word.slice(1);}