let map;


function initMap(locationData) {
  try{
    console.log(locationData.latitude)
    console.log(locationData.longitude)
    map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: locationData.latitude, lng: locationData.longitude },
    zoom: 14,
      });
  }
  catch{}
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
