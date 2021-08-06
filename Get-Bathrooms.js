const gAPI = "QUl6YVN5QkY3SXp0NkQtbUhxMjNHcGFNb3NSbmc0cDcxY3EzWlFJ"


function getBathroomList() {
	fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=bathrooms+around+me&key=${atob(gAPI)}`)
	.then(response => {return response.json()})
	.then(result => {
		console.log(result)
	})
}

getBathroomList()
