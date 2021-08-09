let map;


function initMap(locationData) {
  const mapCenter = new google.maps.LatLng(locationData.latitude,locationData.longitude)
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
      center: mapCenter,
      zoom: 12,
    });
    const request = {
      query: "restrooms near me",
      location: mapCenter,
      radius: '25',
      fields: ["name", "geometry", "rating", "place_id"],
    };
    service = new google.maps.places.PlacesService(map)
    service.textSearch(request, (results, status) => {
      console.log(results)
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
      console.log(place.place_id)
      console.log(place.rating)
    });
  }

async function getUserLocation(locationOutput){
  await fetch('https://ipapi.co/json/')
  .then(response => {
    return response.json()
  }).then(result =>{
    locationOutput(result)
    let map;
  })
}

getUserLocation(async (locationData)=> {
  await initMap(locationData)

})