//Pulling our API keys in from config file -jw

var googleKey = config.googleKey;
var yelpKey = config.yelpKey;
var yelpClient = config.yelpClientID;
var dataKey = config.fireKey;
var postKey = config.postman;

// Initialize Firebase
  var fireDB = {
    apiKey: dataKey,
    authDomain: "a-super-sweet-project.firebaseapp.com",
    databaseURL: "https://a-super-sweet-project.firebaseio.com",
    projectId: "a-super-sweet-project",
    storageBucket: "a-super-sweet-project.appspot.com",
    messagingSenderId: "825679001195"
  };

firebase.initializeApp(fireDB);
var database = firebase.database();

// Vars for holding the values pulled from user input -jw
var term = "";
var loc = "";
var state = "";

// Var for holding category selector

var yelpCat = "categories=restaurants,%20all";

//Separate vars holding the encoded information for the AJAX call -jw
var yelpTerm = "";
var yelpLoc = "";

//Vars for making initial AJAX call and holding the respective responses -jw

var yelpCall = {};
var userChoice ={};
var yelpResponse = {};
var googleResponse;

$("#score-page").hide();



$("#give-review").on("click", function (event) {

  event.preventDefault();

  $("#front-page").hide();
  $("#score-page").show();
  $("#final-page").empty();
  

  // Pulling inputs from fields -jw

  var term = $("#restaurant").val().trim();
  var loc = $("#location").val().trim();
  var state = $("#state").val().trim();

  // Adding search terms and encoding as Universal Resource Identifier -jw

  var yelpTerm = "term=" + encodeURI(term);
  var yelpLoc = "location=" + encodeURI(loc)+"%20"+state;

  //Console logging to make sure it works -jw

  console.log(yelpTerm);
  console.log(yelpLoc);

  // Formatting the Yelp Ajax call settings as an object -jw

  var yelpCall = {
    "async": true,
    "crossDomain": true,
    "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?" + yelpTerm + "&" + yelpLoc + "&" + yelpCat,
    "method": "GET",
    "dataType": "json",
    "headers": {
      "cache-control": "no-cache",
      "Postman-Token": postKey,
      "Authorization": "Bearer " + yelpKey
    }
  };

  // Calling Yelp and console Logging the response -jw
  

  $.ajax(yelpCall).done(function (response) {
    console.log(response);

    yelpResponse = response;



    for (var i = 0; i < response.businesses.length; i++) {

      var businessName = response.businesses[i].name;
      var businessCity = response.businesses[i].location.city;
      var businessStreet = response.businesses[i].location.address1;
      var businessRating = response.businesses[i].rating;

      tr = $('<tr/>');
        tr.attr("title","Click a search result to continue")
        tr.attr("id", i);
        tr.addClass("result");
        tr.append("<td>" + businessName + "</td>");
        tr.append("<td>" + businessCity + "</td>");
        tr.append("<td>" + businessStreet + "</td>");
        tr.append("<td>" + businessRating + "</td>");

        $("#yelp-reviwews-body").append(tr);

    }

  });

});

function getResult(){
  
  var click = (this).id;

  database.ref().push(yelpResponse.businesses[click]).then ($("#yelp-reviwews-body").empty())

};

$(document).on("click", ".result", getResult);


// Google api get last added child from firebase and make google api call to get rating. -ap

database.ref().limitToLast(1).on("child_added", function(snapshot){
  console.log("yelp snapshot: " + snapshot.val());
  userChoice = snapshot.val();
  console.log(userChoice);
  var lat = snapshot.val().coordinates.latitude;
  var lon = snapshot.val().coordinates.longitude;
  console.log("lat &lon" + lat + lon);
  var input = snapshot.val().name;
  var placeInput = "input=" + encodeURI(input);
  var location = "locationbias=point:" +lat+","+lon;
  var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?" + placeInput + "&inputtype=textquery&fields=photos,formatted_address,name,opening_hours,rating&"+location+"&key="+googleKey
  console.log("queryurl: " + queryURL);
  $.ajax({
  url: queryURL,
  method: "GET"
  }).done(function(gresponse) {
    googleResponse = gresponse;
  //console.log("google api response:" + googleResponse.candidates[0].rating);

    var googleRating =  googleResponse.candidates[0].rating
    var yelpRating = userChoice.rating;
    var ourScore = ((googleRating + yelpRating) / 2);

    console.log(yelpRating);
    console.log(googleRating);
    console.log(ourScore);

    var y = $("<p>");
    var g = $("<p>");
    var s = $("<p>")

    y.addClass("yelp-score");
    y.append("Yelp Rating: " + yelpRating);

    g.addClass("google-score");
    g.append("Google Rating: " + googleRating);

    s.addClass("our-score");
    s.append("Soux Vide Rating: " + ourScore);


    $("#final-page").append(y, g, s);

  });
  
});

