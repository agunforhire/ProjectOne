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
    "headers": {
      "cache-control": "no-cache",
      "Postman-Token": postKey,
      "Authorization": "Bearer " + yelpKey
    }
  };

  // Calling Yelp and console Logging the response

  $.ajax(yelpCall).done(function (response) {
    console.log(response);
  });

});