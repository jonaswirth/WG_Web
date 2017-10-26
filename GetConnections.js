/**
 * Created by nicol on 28.09.2017.
 */

var instantMilliSeconds = 0;

/*Constants*/
const apiBaseUrl = "http://transport.opendata.ch/v1/connections";
const startPosition = "Wallisellen_Neugut";

/*Destination and destinationDisplayNames must be in the same order*/
const destinations = ["zurich_Flughafen_Fracht","zurich_HB","zurich_ETH","zurich_ETH_Hoenggerberg"];
const destinationDisplayNames = ["Zürich Flughafen, Fracht", "Zürich HB", "Zürich ZH, ETH/Universitätsspital" , "Zürich, ETH Hönggerberg"];


function getUrl(destination){
  var date = new Date();
  return apiBaseUrl + "?time=" + date.getHours() + ":" + date.getMinutes() + "&from=" + startPosition + "&to=" + destination;
}

function updateDestination(destination, departure, minutesLeft, duration, arrival, vehicle){
  /*Map display name to index*/
  var index = parseInt(destinationDisplayNames.indexOf(destination)) + 1;

  document.getElementById("departureTime"+index).innerHTML = formatTime(departure);
  document.getElementById("departMin"+index).innerHTML = minutesLeft + " min";
  document.getElementById("duration"+index).innerHTML = duration + " min";
  document.getElementById("type"+index).innerHTML = vehicle;
  document.getElementById("arrivalTime"+index).innerHTML = formatTime(arrival);

  if(minutesLeft <= 5){
    document.getElementById("departMin"+index).style.color = "red";
  }else{
    document.getElementById("departMin"+index).style.color = "black";
  }
}

function formatTime(date){
  var hours;
  var minutes;
  if (date.getHours() / 10 < 1) {
      hours = '0' + date.getHours();
  }
  else hours = date.getHours();
  if (date.getMinutes() / 10 < 1) {
      minutes = '0' + date.getMinutes();
  }
  else minutes = date.getMinutes();
  return hours + ':' + minutes;
}

function getVehicle(vehicle){
  return vehicle.category + vehicle.number + " > " + vehicle.to;
}

/*Get the next connection*/
function getConnection(connections){
  var currentTime = new Date();
  for(var i in connections){
    if(currentTime - new Date(connections[i].from.departure) < 0)
      return connections[i];
  }
}

var getConnections = function () {
    for(var i in destinations){
      axios.get(getUrl(destinations[i]))
      .then(function(response){
          /*Parse response*/
          var currentTime = new Date();
          var connection = getConnection(response.data.connections);

          var departureTime = new Date(connection.from.departure);
          var minutesLeft = Math.round((((departureTime - currentTime) % 86400000) % 3600000) / 60000);
          var arrivalDate = new Date(connection.to.arrival);
          var duration = Math.round((((arrivalDate - departureTime) % 86400000) % 3600000) / 60000);

          var vehicle = getVehicle(connection.sections[0].journey);
          var destination = response.data.to.name;

          updateDestination(destination, departureTime, minutesLeft, duration, arrivalDate, vehicle);
      })
      .catch(function(error){
        console.log(error);
      })
    }

    instantMilliSeconds = new Date().getMilliseconds();
}

getConnections();

setTimeout(function(){
    getConnections();
}, 60000 - instantMilliSeconds);

setInterval(function(){
   getConnections();
}, 60000);
