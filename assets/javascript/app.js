//initialize firebase
var config = {
    apiKey: "AIzaSyAIarLljTOik8spZsKfP2dKztRE6Ycp4rA",
    authDomain: "train-project-nw.firebaseapp.com",
    databaseURL: "https://train-project-nw.firebaseio.com",
    projectId: "train-project-nw",
    storageBucket: "train-project-nw.appspot.com",
    messagingSenderId: "497097807166"
  };
  firebase.initializeApp(config);

  //reference to firebase
  var database = firebase.database();

  //variables
  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = "";
  var minutesAway = 0;

  //submit button click capture
  $("#add-train").on("click", function() {
      event.preventDefault();

    //update variables with data input
    trainName = $("#train-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrainTime = moment($("#time-input").val().trim(), "hh:mm").format("X");
    frequency = $("#minutes-input").val().trim();

    //setting up JSON for database
    var newTrain = {
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
      };

    //send train data to database
    database.ref().push(newTrain);
    alert("Train added to schedule");

     //text box clear
    $("#train-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#minutes-input").val("");
  });

  //firebase adds row with new information
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    //store into variables
      var trainName = childSnapshot.val().trainName;
      var destination = childSnapshot.val().destination;
      var firstTrainTime = childSnapshot.val().firstTrainTime;
      var frequency = childSnapshot.val().frequency;
        //console.log(trainName);
    
    //moment js for time conversion
      var trainArrival = moment.unix(firstTrainTime).format("hh:mm a");
        //console.log(trainArrival);
    
    //moment js math conversions
      var convertTime = moment(firstTrainTime, "hh:mm").subtract(1, "years");
        //console.log(convertTime);
      var timeChange = moment().diff(moment(convertTime), "minutes");
        //console.log("DIFFERENCE IN TIME: " + timeChange);
      var tRemainder = timeChange % frequency;
        //console.log(tRemainder);
      var minutesTil = frequency - tRemainder;
        //console.log("MINUTES TILL TRAIN: " + minutesTil);
    
    //append new train data
      $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
      frequency + "</td><td>" + trainArrival + "</td><td>" + minutesTil + "</td><td>");
    
    //error handle
    }, function(errorObject){
    console.log("The read failed: " + errorObject.code)
    });