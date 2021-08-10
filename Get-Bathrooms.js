let prev_infowindow =false;


function drawMap(locationData) {
  const mapCenter = new google.maps.LatLng(locationData.latitude,locationData.longitude)
  map = new google.maps.Map(document.getElementById("map"), {
      center: mapCenter,
      zoom: 12,
    });
    const request = {
      query: "restrooms near me",
      location: mapCenter,
      //todo Switch this to dropdown value
      radius: '25',
      fields: ["name", "geometry", "place_id"],
    };
    service = new google.maps.places.PlacesService(map)
    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
        map.setCenter(results[0].geometry.location)
      }
    });
  }
  
async function createMarker(place) {

    if (!place.geometry || !place.geometry.location) return;
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
      title: place.name
    });
    marker.addListener("click", () => {
      if( prev_infowindow ) {
        prev_infowindow.close()
      }
      
      getPlaceInformation(place.place_id, function(placeinfo) {
        // Check if the place has a rating, if not change it to a readable format
        if (placeinfo.rating == null){ newrating = "not rated" }else { newrating = `rated ${placeinfo.rating}`}
        

        //This is teh popup info, edit this to change what info we display on clicking a marker
        let contentInfo = `<div id="infowindow"><b>${placeinfo.name}</b><br>${placeinfo.formatted_address}<br><a href="https://www.google.com/maps/place/${placeinfo.formatted_address}">Google Maps</a></div>`
        
        const infowindow = new google.maps.InfoWindow({
          content: contentInfo
        })
        prev_infowindow = infowindow;
        infowindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        })
      })
    })
  }

function getPlaceInformation(placeid, completion) {
  var request = {
    placeId: placeid,
    //We need to edit these field to get info we care about per location
    fields: ['name', 'rating', 'formatted_phone_number', 'geometry', 'formatted_address', 'review']
  };
  
  service = new google.maps.places.PlacesService(map)
  service.getDetails(request, function(placeinfo, status) {
    completion(placeinfo)
  })
}

async function getUserLocation(locationOutput){
  await fetch('https://ipapi.co/json/')
  .then(response => {
    return response.json()
  }).then(result =>{
    locationOutput(result)
  })
}

getUserLocation(async (locationData)=> {
  drawMap(locationData)

})