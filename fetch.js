// Define URL for API call
let url = "https://api.wheretheiss.at/v1/satellites/25544"

// Locate latitude, longitude, and time fetched HTML elements. Will use these to display values to visitor.
let issLat = document.querySelector('#iss-lat')
let issLong = document.querySelector('#iss-long')
let timeFetched = document.querySelector('#time')

// Set location update interval to 10,000 milliseconds (10 seconds)
let update = 10000

// Set maximum failed API call attempts to 3
let maxFailedAttempts = 3

// Declare a variable for the ISS map marker but do not initialize at this point as ISS coordinates have not yet been retrieved
let issMarker

// Define the custom ISS map marker
let issIcon = L.icon({
    iconUrl: 'icon.png',
    iconSize: [50, 50],
    iconSize: [25, 25]
})


// Create map centered on lat/long 0,0. Set zoom to 1 (least zoom, view of whole world)
let map = L.map('iss-map').setView([0,0], 1)

// Add Open Street Map tile layer to map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Call iss() with argument of max 3 failed API call attempts
iss(maxFailedAttempts)

// Define function to call API, retrieve ISS location, display lat & long and time fetched to user, and move map marker
function iss(attempts) {

    // End program if max failed API call attempts has been exceeded
    if (attempts <= 0) {
        alert('Failed to contact ISS server after several attempts')
        return
    }

    // Request ISS location data from API
    fetch(url)

        // Convert raw data to JSON
        .then( res => res.json() )

        .then(issData => {
            console.log(issData)
            // Retrieve coordinates from location  and display on page
            let lat = issData.latitude
            let long = issData.longitude
            issLat.innerHTML = lat
            issLong.innerHTML = long

            // Create marker if it does not already exists and add to map
            if (!issMarker) {
                issMarker = L.marker( [lat, long], {icon: issIcon} ).addTo(map)
            // Update marker location to current coords if it already exists
            } else {
                issMarker.setLatLng([lat, long])
            }

            // Get current date and time and display on page
            let now = Date()
            timeFetched.innerHTML = now
        })

        // Catch errors if fetch(url) or res.json() fail to resolve
        // If either fails, decrement max attempts counter
        .catch(err => {
            attempts--
            console.log('ERROR', err)
        })

        // Call iss() function again after waiting for the specified update interval
        .finally( () => setTimeout(iss, update, attempts))

}




