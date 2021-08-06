function getUserLocation(locationOutput){
  fetch('https://ipapi.co/json')
  .then(response => {
    return response.json()
  }).then(result =>{
    locationOutput(result)
  })
}

let map;
let service;
let infowindow;

function initMap(locationData) {
  console.log(locationData.latitude)
  const sydney = new google.maps.LatLng(locationData.latitude, locationData.longitude);
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: sydney,
    zoom: 15,
  });
  const request = {
    query: "Museum of Contemporary Art Australia",
    fields: ["name", "geometry"],
  };
  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
      map.setCenter(results[0].geometry.location);
    }
  });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });
  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

getUserLocation((locationData)=> {
  initMap(locationData)
})