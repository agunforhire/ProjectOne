var googleKey = config.googleKey;
var yelpKey = config.yelpKey;
var yelpClient = config.yelpClientID;
var dataKey = config.fireKey;
var postKey = config.postman

// Initialize Firebase
var config = {
  apiKey: dataKey,
  authDomain: "ucb-project-one.firebaseapp.com",
  databaseURL: "https://ucb-project-one.firebaseio.com",
  projectId: "ucb-project-one",
  storageBucket: "ucb-project-one.appspot.com",
  messagingSenderId: "191816644229"
};

firebase.initializeApp(config);

var yelpTerm = "";
var yelpLoc = "";
var term = "";
var loc = "";
var yelpCall = {};

$("#score-page").hide();

$("#give-review").on("click", function (event) {

  event.preventDefault();

  $("#front-page").hide();
  $("#score-page").show();
  

  // Pulling inputs from fields

  var term = $("#restaurant").val().trim();
  var loc = $("#location").val().trim();
  var state = $("#state").val().trim();

  // Adding search terms and encoding as Universal Resource Identifier

  var yelpTerm = "term=" + encodeURI(term);
  var yelpLoc = "location=" + encodeURI(loc)+"%20"+state;

  //Console logging to make sure it works

  console.log(yelpTerm);
  console.log(yelpLoc);

  // Formatting the Yelp Ajax call settings as an object

  var yelpCall = {
    "async": true,
    "crossDomain": true,
    "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?" + yelpTerm + "&" + yelpLoc,
    "method": "GET",
    "dataType": "json",
    "headers": {
      "cache-control": "no-cache",
      "Postman-Token": postKey,
      "Authorization": "Bearer " + yelpKey
    }
  };

  // Calling Yelp and console Logging the response
  

  $.ajax(yelpCall).done(function (response) {
    console.log(response);
    
    for (var i = 0; i < response.businesses.length; i++) {

      var businessName = response.businesses[i].name;
      var businessCity = response.businesses[i].location.city;
      var businessStreet = response.businesses[i].location.address1;
      var businessRating = response.businesses[i].rating;
    
      console.log(businessName);
      console.log(businessCity);
      console.log(businessStreet);
      console.log(businessRating);

      tr = $('<tr/>');

        tr.append("<td>" + businessName + "</td>");
        tr.append("<td>" + businessCity + "</td>");
        tr.append("<td>" + businessStreet + "</td>");
        tr.append("<td>" + businessRating + "</td>");

        $("#yelp-reviwews-body").append(tr);

        
    }

  });

});
