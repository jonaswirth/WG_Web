/**
 * Created by nicol on 28.09.2017.
 */

var instantMilliSeconds = 0;

var getConnectionUno = function () {
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

    var hour = new Date().getHours();
    var minute = new Date().getMinutes();
    instantMilliSeconds = new Date().getMilliseconds();

    var flugHafenConnection = new HttpClient();
    flugHafenConnection.get('http://transport.opendata.ch/v1/connections?time=' + hour + ':' + minute + '&from=Wallisellen_Neugut&to=zurich_Flughafen_Fracht', function (response) {
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


        document.getElementById("destination1").innerHTML = "Zürich Airport";
        document.getElementById("departureTime1").innerHTML = "Departure: " + departureTime;
        document.getElementById("departMin1").innerHTML = "Leaves in: " + diffMins + " min";
        document.getElementById("duration1").innerHTML = "Duration: " + durration + " min";
        document.getElementById("type1").innerHTML = "Vehicle: " + vehicleCategory + "" + vehicleNumber;
        document.getElementById("arrivalTime1").innerHTML = "Arrival: " + arrivalTime;

        console.log(focusedConnection);
    });
}

getConnectionUno();

setTimeout(function(){
    getConnectionUno();
}, 60000 - instantMilliSeconds);

setInterval(function(){
    getConnectionUno();
}, 60000);