// JavaScript pubnub with Google Maps API: https://www.pubnub.com/blog/javascript-google-maps-api-map-markers/

window.lat = 48.163623;
window.lng = 11.563508;

var map;
var mark;
var coordinatesPath = [];
  
var initialize = function() {
  map  = new google.maps.Map(document.getElementById('map'), {center:{lat:lat,lng:lng},zoom:16});
  mark = new google.maps.Marker({position:{lat:lat, lng:lng}, map:map});
};

window.initialize = initialize;

var redraw = function(payload) {
  if(payload.message.lat){
  lat = payload.message.lat;
  lng = payload.message.lng;
  document.getElementById("current-location").textContent="latitude: " + lat + " longitude: " + lng;

  map.setCenter({lat:lat, lng:lng, alt:0});
  mark.setPosition({lat:lat, lng:lng, alt:0});
  
  coordinatesPath.push(new google.maps.LatLng(lat, lng));

  var lineCoordinatesPath = new google.maps.Polyline({
    path: coordinatesPath,
    geodesic: true,
    strokeColor: '#e07878'
  });
  
  lineCoordinatesPath.setMap(map);}
};

var channel = "pi-gps-tracker";

var pubnub = new PubNub({
  publishKey:   'KEY',
  subscribeKey: 'KEY'
});
    
document.querySelector('#start').addEventListener('click', function(){
      pubnub.subscribe({channels: [channel]});
      pubnub.addListener({message:redraw});
    });

document.querySelector('#stop').addEventListener('click', function(){
    pubnub.unsubscribe( {channels: [channel] });
  });