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
        console.log(response);
          var currentTime = new Date();
          var connection = getConnection(response.data.connections);

          var departureTime = new Date(connection.from.departure);
          var minutesLeft = Math.round((((departureTime - currentTime) % 86400000) % 3600000) / 60000);
          var arrivalDate = new Date(connection.to.arrival);
          var duration = Math.round((((arrivalDate - departureTime) % 86400000) % 3600000) / 60000);

          var vehicle = getVehicle(connection.sections[0].journey);
          var destination = response.data.to.name;

          //console.log(departureTime + '\n' + diffMins + '\n' + arrivalDate + '\n' + durration);
          updateDestination(destination, departureTime, minutesLeft, duration, arrivalDate, vehicle);
      })
      .catch(function(error){
        console.log(error);
      })
    }



    var HttpClient = function () {
        this.get = function (url, callBack) {
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState == 4 && httpRequest.status == 200)
                    callBack(httpRequest.responseText);
            }

            httpRequest.open("GET", url, true);
            httpRequest.send(null);
        }
    }

    instantMilliSeconds = new Date().getMilliseconds();

    var flugHafenConnection = new HttpClient();
    flugHafenConnection.get(getUrl("zurich_Flughafen_Fracht"), function (response) {
        var jsonReturn = JSON.parse(response);
        var connectionLength = jsonReturn.connections.length;
        var focusedConnection, currentTime;

        for (var i = 0; i < connectionLength; i++) {
            var departureTime = new Date(jsonReturn.connections[i].from.departure);
            currentTime = new Date(Date.now());
            if (currentTime - departureTime < 0) {
                focusedConnection = jsonReturn.connections[i];
                break;
            }
        }

        var departureTime = new Date(focusedConnection.from.departure);
        var diffMins = Math.round((((departureTime - currentTime) % 86400000) % 3600000) / 60000);
        var arrivalDate = new Date(focusedConnection.to.arrival);
        var durration = Math.round((((arrivalDate - departureTime) % 86400000) % 3600000) / 60000);

          /**/

        /***************************************************************************************************/
        var departureHours;
        var departureMinutes;
        if (departureTime.getHours() / 10 < 1) {
            departureHours = '0' + departureTime.getHours();
        }
        else departureHours = departureTime.getHours();
        if (departureTime.getMinutes() / 10 < 1) {
            departureMinutes = '0' + departureTime.getMinutes();
        }
        else departureMinutes = departureTime.getMinutes();
        departureTime = departureHours + ':' + departureMinutes;


        var arrivalHours;
        var arrivalMinutes;
        if (arrivalDate.getHours() / 10 < 1) {
            arrivalHours = '0' + arrivalDate.getHours();
        }
        else arrivalHours = arrivalDate.getHours();
        if (arrivalDate.getMinutes() / 10 < 1) {
            arrivalMinutes = '0' + arrivalDate.getMinutes();
        }
        else arrivalMinutes = arrivalDate.getMinutes();
        var arrivalTime = arrivalHours + ':' + arrivalMinutes;

        /**************************************************************************************************/


        var vehicleCategory = focusedConnection.sections[0].journey.category;
        var vehicleNumber = focusedConnection.sections[0].journey.number;
        var direction = focusedConnection.sections[0].journey.to;

        document.getElementById("departureTime1").innerHTML = departureTime;
        if (diffMins > 5) {
            document.getElementById("departMin1").innerHTML = diffMins + " min";
        }
        else{
            document.getElementById("departMin1").innerHTML = diffMins + " min";
            var colorChanger = document.getElementById("departMin1");
            colorChanger.style.color = "red";
        }
        /*document.getElementById("duration1").innerHTML = durration + " min";*/
        document.getElementById("type1").innerHTML = vehicleCategory + "" + vehicleNumber + " > " + direction;
        document.getElementById("arrivalTime1").innerHTML = arrivalTime;

        console.log(focusedConnection);
    });

    var HBConnection = new HttpClient();
    HBConnection.get(getUrl("zurich_HB"), function (response) {
        var jsonReturn = JSON.parse(response);
        var connectionLength = jsonReturn.connections.length;
        var focusedConnection, currentTime;

        for (var i = 0; i < connectionLength; i++) {
            var departureTime = new Date(jsonReturn.connections[i].from.departure);
            currentTime = new Date(Date.now());
            if (currentTime - departureTime < 0) {
                focusedConnection = jsonReturn.connections[i];
                break;
            }
        }

        var departureTime = new Date(focusedConnection.from.departure);
        var diffMins = Math.round((((departureTime - currentTime) % 86400000) % 3600000) / 60000);
        var arrivalDate = new Date(focusedConnection.to.arrival);
        var durration = Math.round((((arrivalDate - departureTime) % 86400000) % 3600000) / 60000);


        /***************************************************************************************************/
        var departureHours;
        var departureMinutes;
        if (departureTime.getHours() / 10 < 1) {
            departureHours = '0' + departureTime.getHours();
        }
        else departureHours = departureTime.getHours();
        if (departureTime.getMinutes() / 10 < 1) {
            departureMinutes = '0' + departureTime.getMinutes();
        }
        else departureMinutes = departureTime.getMinutes();
        departureTime = departureHours + ':' + departureMinutes;


        var arrivalHours;
        var arrivalMinutes;
        if (arrivalDate.getHours() / 10 < 1) {
            arrivalHours = '0' + arrivalDate.getHours();
        }
        else arrivalHours = arrivalDate.getHours();
        if (arrivalDate.getMinutes() / 10 < 1) {
            arrivalMinutes = '0' + arrivalDate.getMinutes();
        }
        else arrivalMinutes = arrivalDate.getMinutes();
        var arrivalTime = arrivalHours + ':' + arrivalMinutes;

        /**************************************************************************************************/


        var vehicleCategory = focusedConnection.sections[0].journey.category;
        var vehicleNumber = focusedConnection.sections[0].journey.number;
        var direction = focusedConnection.sections[0].journey.to;

        document.getElementById("departureTime2").innerHTML = departureTime;
        if (diffMins > 5) {
            document.getElementById("departMin2").innerHTML = diffMins + " min";
        }
        else{
            document.getElementById("departMin2").innerHTML = diffMins + " min";
            var colorChanger = document.getElementById("departMin2");
            colorChanger.style.color = "red";
        }
        /*document.getElementById("duration2").innerHTML = durration + " min";*/
        document.getElementById("type2").innerHTML = vehicleCategory + "" + vehicleNumber + " > " + direction;
        document.getElementById("arrivalTime2").innerHTML = arrivalTime;

        console.log(focusedConnection);
    });

    var ETHConnection = new HttpClient();
    ETHConnection.get(getUrl("zurich_ETH"), function (response) {
        var jsonReturn = JSON.parse(response);
        var connectionLength = jsonReturn.connections.length;
        var focusedConnection, currentTime;

        for (var i = 0; i < connectionLength; i++) {
            var departureTime = new Date(jsonReturn.connections[i].from.departure);
            currentTime = new Date(Date.now());
            if (currentTime - departureTime < 0) {
                focusedConnection = jsonReturn.connections[i];
                break;
            }
        }

        var departureTime = new Date(focusedConnection.from.departure);
        var diffMins = Math.round((((departureTime - currentTime) % 86400000) % 3600000) / 60000);
        var arrivalDate = new Date(focusedConnection.to.arrival);
        var durration = Math.round((((arrivalDate - departureTime) % 86400000) % 3600000) / 60000);


        /***************************************************************************************************/
        var departureHours;
        var departureMinutes;
        if (departureTime.getHours() / 10 < 1) {
            departureHours = '0' + departureTime.getHours();
        }
        else departureHours = departureTime.getHours();
        if (departureTime.getMinutes() / 10 < 1) {
            departureMinutes = '0' + departureTime.getMinutes();
        }
        else departureMinutes = departureTime.getMinutes();
        departureTime = departureHours + ':' + departureMinutes;


        var arrivalHours;
        var arrivalMinutes;
        if (arrivalDate.getHours() / 10 < 1) {
            arrivalHours = '0' + arrivalDate.getHours();
        }
        else arrivalHours = arrivalDate.getHours();
        if (arrivalDate.getMinutes() / 10 < 1) {
            arrivalMinutes = '0' + arrivalDate.getMinutes();
        }
        else arrivalMinutes = arrivalDate.getMinutes();
        var arrivalTime = arrivalHours + ':' + arrivalMinutes;

        /**************************************************************************************************/


        var vehicleCategory = focusedConnection.sections[0].journey.category;
        var vehicleNumber = focusedConnection.sections[0].journey.number;
        var direction = focusedConnection.sections[0].journey.to;

        document.getElementById("departureTime3").innerHTML = departureTime;
        if (diffMins > 5) {
            document.getElementById("departMin3").innerHTML = diffMins + " min";
        }
        else{
            document.getElementById("departMin3").innerHTML = diffMins + " min";
            var colorChanger = document.getElementById("departMin3");
            colorChanger.style.color = "red";
        }
        /*document.getElementById("duration3").innerHTML = durration + " min";*/
        document.getElementById("type3").innerHTML = vehicleCategory + "" + vehicleNumber + " > " + direction;
        document.getElementById("arrivalTime3").innerHTML = arrivalTime;

        console.log(focusedConnection);
    });

    var HonggConnection = new HttpClient();
    HonggConnection.get(getUrl("zurich_ETH_Hoenggerberg"), function (response) {
        var jsonReturn = JSON.parse(response);
        var connectionLength = jsonReturn.connections.length;
        var focusedConnection, currentTime;

        for (var i = 0; i < connectionLength; i++) {
            var departureTime = new Date(jsonReturn.connections[i].from.departure);
            currentTime = new Date(Date.now());
            if (currentTime - departureTime < 0) {
                focusedConnection = jsonReturn.connections[i];
                break;
            }
        }

        var departureTime = new Date(focusedConnection.from.departure);
        var diffMins = Math.round((((departureTime - currentTime) % 86400000) % 3600000) / 60000);
        var arrivalDate = new Date(focusedConnection.to.arrival);
        var durration = Math.round((((arrivalDate - departureTime) % 86400000) % 3600000) / 60000);


        /***************************************************************************************************/
        var departureHours;
        var departureMinutes;
        if (departureTime.getHours() / 10 < 1) {
            departureHours = '0' + departureTime.getHours();
        }
        else departureHours = departureTime.getHours();
        if (departureTime.getMinutes() / 10 < 1) {
            departureMinutes = '0' + departureTime.getMinutes();
        }
        else departureMinutes = departureTime.getMinutes();
        departureTime = departureHours + ':' + departureMinutes;


        var arrivalHours;
        var arrivalMinutes;
        if (arrivalDate.getHours() / 10 < 1) {
            arrivalHours = '0' + arrivalDate.getHours();
        }
        else arrivalHours = arrivalDate.getHours();
        if (arrivalDate.getMinutes() / 10 < 1) {
            arrivalMinutes = '0' + arrivalDate.getMinutes();
        }
        else arrivalMinutes = arrivalDate.getMinutes();
        var arrivalTime = arrivalHours + ':' + arrivalMinutes;

        /**************************************************************************************************/


        var vehicleCategory = focusedConnection.sections[0].journey.category;
        var vehicleNumber = focusedConnection.sections[0].journey.number;
        var direction = focusedConnection.sections[0].journey.to;

        document.getElementById("departureTime4").innerHTML = departureTime;
        if (diffMins > 5) {
            document.getElementById("departMin4").innerHTML = diffMins + " min";
        }
        else{
            document.getElementById("departMin4").innerHTML = diffMins + " min";
            var colorChanger = document.getElementById("departMin4");
            colorChanger.style.color = "red";
        }
        /*document.getElementById("duration4").innerHTML = durration + " min";*/
        document.getElementById("type4").innerHTML = vehicleCategory + "" + vehicleNumber + " > " + direction;
        document.getElementById("arrivalTime4").innerHTML = arrivalTime;

        console.log(focusedConnection);
    });


}

getConnections();

setTimeout(function(){
    getConnections();
}, 60000 - instantMilliSeconds);

setInterval(function(){
   getConnections();
}, 60000);
