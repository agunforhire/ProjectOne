var googleKey = config.googleKey;
var yelpKey = config.yelpKey;
var yelpClient = config.yelpClientID;
var dataKey = config.fireKey;

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

  $("#give-review").on("click", function() {
    $("#front-page").hide();
    $("#score-page").show();
  
  });
