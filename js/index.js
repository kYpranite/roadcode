otmApiKey= "5ae2e3f221c38a28845f05b63f732523be8926b6484b88151a8dd476";
gmApiKey = "AIzaSyCTlMIrLbEtYu8K7Kheto9hxaIqWjzOQ8E"
wApiKey = "jA5nqVNx_QBSh4TNxLr-"

const fetchJson = async (link) => {
    const response = await fetch(link);
    const myJson = await response.json(); //extract JSON from the http response
}



const userAction = async (link) => {
    const response = await fetch(link);
    return await response.json(); //extract JSON from the http response
    // do something with myJson
  }

const getAttractions = async(radius, lat, lon, kinds,) => {
    let kindsstr = toString(kinds);
    const attractions = await userAction("http://api.opentripmap.com/0.1/en/places/radius?radius="
    + radius
    + "&lon=" + lon
    + "&lat=" + lat 
    + "&kinds=" + kindsstr
    + "&format=geojson&apikey=" + otmApiKey);
    return attractions
}

const getWater = async(lat, lon) => {
    const water = await userAction("https://api.onwater.io/api/v1/results/" + lat +","+ lon + "?access_token=" + wApiKey)
    return water;
}

async function genDestinationPoint(lat, lon, radius)
{
    let point;
    var count = 0;
    let onWater;
    do{
        point = generateRandomPoint(lat,lon, radius)
        count += 1;
        onWater = await getWater(point.lat, point.lon);
    }while( count < 10 && onWater.water)
    if(count < 10)
    {
        return point
    }
    return false;
}
function generateRandomPoint(lat, lon, radius) {
    var x0 = lon;
    var y0 = lat;
    // Convert Radius from meters to degrees.
    var rd = radius/111300;
  
    var u = 1 - Math.random() * 0.1;
    var v = Math.random();
  
    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);
  
    var xp = x/Math.cos(y0);
  
    // Resulting point.
    return {'lat': y+y0, 'lon': xp+x0};
  }

function toString(kinds){
    let result = "";
    for(let i = 0; i < kinds.length; i++)
    {
        result += kinds[i]
    }
    return result
}
async function logPromiseResult() {
    console.log(await getAttractions(1000000, 33.656956, -117.798633, ["historic"]));
}
logPromiseResult();

userAction('http://api.opentripmap.com/0.1/en/places/bbox?lon_min=38.364285&lat_min=59.855685&lon_max=38.372809&lat_max=59.859052&kinds=churches&format=geojson&apikey=' + otmApiKey);
userAction('http://api.opentripmap.com/0.1/en/places/xid/W37900074?apikey=' + otmApiKey);

function initMap() {
    const directionsRenderer = new google.maps.DirectionsRenderer({draggable: true});
    const directionsService = new google.maps.DirectionsService();
    map = new google.maps.Map($("#map")[0], {
        center: { lat: 36.967243, lng: -99.771556}, //center of US
        zoom: 5,
    });
    directionsRenderer.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsRenderer);
};

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const waypoints = [{location: "bakersfield, ca"}, {location:"tampa, fl"}]; //order doesn't matter as long as optimizeWaypoints is set to true

  directionsService
    .route({
      origin: "Irvine, CA", //can also take placeId and long/lat
      destination: "New York City, New York",
      waypoints: waypoints,
      travelMode: "DRIVING",
      optimizeWaypoints: true,
    })
    .then((response) => {
      directionsRenderer.setDirections(response); //if direction service receives a response, then render the directions given
    })
    .catch((e) => window.alert("Directions request failed")); //else no response, leave error message
}



  


userAction('http://api.opentripmap.com/0.1/en/places/bbox?lon_min=38.364285&lat_min=59.855685&lon_max=38.372809&lat_max=59.859052&kinds=churches&format=geojson&apikey=' + otmApiKey);
userAction('http://api.opentripmap.com/0.1/en/places/xid/W37900074?apikey=' + otmApiKey);
genDestinationPoint(33.656956, -117.798633, 100000)
// console.log(generateRandomPoint( 33.656956, -117.798633, 100000));
