const ratingFilter = document.getElementById("rating-dropdown")
const distancefilter = document.getElementById("distances")
const carouseldata0 = document.getElementById("carouselItem0")
const carouseldata1 = document.getElementById("carouselItem1")
const carouseldata2 = document.getElementById("carouselItem2")

let prev_infowindow =false;
let starfilter = 0

ratingFilter.addEventListener("change", function() {
  if (this.value == "5-star") {
    starfilter = 5
  } else if (this.value == "4-star") {
    starfilter = 4
  } else if (this.value == "3-star") {
    starfilter = 3
  } else if (this.value == "2-star") {
    starfilter = 2
  } else if (this.value == "1-star") {
    starfilter = 1
  } else if (this.value == "NoPreference") {
    starfilter = 0
  } 
  getUserLocation(async (locationData)=> {
    drawMap(locationData)
  })
})


function drawMap(locationData) {
  const mapCenter = new google.maps.LatLng(locationData.latitude,locationData.longitude)
  map = new google.maps.Map(document.getElementById("map"), {
      center: mapCenter,
      zoom: 13,
    })
    
  var marker = new google.maps.Marker({
    position: mapCenter,
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillOpacity: 1,
      strokeWeight: 2,
      fillColor: '#5384ED',
      strokeColor: '#ffffff',
    }})
    
    const request = {
      query: "restrooms near me",
      location: mapCenter,
      radius: 10,
      fields: ["name", "geometry", "place_id"],
    };
    service = new google.maps.places.PlacesService(map)
    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          if (results[i].rating >= starfilter){
            createMarker(results[i]);
          }
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
        

        //This is the popup info, edit this to change what info we display on clicking a marker
        let contentInfo = `<div id="infowindow"><b>${placeinfo.name}</b><br>${placeinfo.formatted_address}<br><a href="https://www.google.com/maps/place/${placeinfo.formatted_address}">Google Maps</a></div>`

        if( placeinfo.reviews != null){
            if (placeinfo.reviews[0] != null){
              if (placeinfo.reviews[0].text != ""){
                carouseldata0.innerHTML = placeinfo.reviews[0].text
              }else {
                console.log("review is blank, we need a fake review")
                fakeReviews(carouseldata0)
              }
            }else {
              console.log("need a fake review")
              fakeReviews(carouseldata0)
            }
          
          if (placeinfo.reviews[1] != null){
            if (placeinfo.reviews[1].text != ""){
              carouseldata1.innerHTML = placeinfo.reviews[1].text
            }else {
              console.log("review is blank, we need a fake review")
              fakeReviews(carouseldata1)
            }
          }else {
            console.log("need a fake review")
            fakeReviews(carouseldata1)
          }
          
          if (placeinfo.reviews[2] != null){
            if (placeinfo.reviews[2].text != ""){
              carouseldata2.innerHTML = placeinfo.reviews[2].text
            }else {
              console.log("review is blank, we need a fake review")
              fakeReviews(carouseldata2)
            }
          }else {
            console.log("need a fake review")
            fakeReviews(carouseldata2)
          }
          
        }else {
          console.log("no reviews found! we need 3 fake reviews")
          fakeReviews(carouseldata0)
          fakeReviews(carouseldata1)
          fakeReviews(carouseldata2)
        }

        
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
  
function fakeReviews(docelement) {
  // These are our real fake reviews, come on down and read our reviews created entirely in their natural artificial habitat
  const reviews = ["Terrible, pee all over the seat!","c","b"]
  let random = Math.floor(Math.random() * reviews.length)
  console.log(reviews[random])
  docelement.innerHTML = reviews[random]
}

function getPlaceInformation(placeid, completion) {
  var request = {
    placeId: placeid,
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