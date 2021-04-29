// this is the map without the searchbar and add function
let map, locateWindow, storeInfo;
let markers = [];
const user = document.currentScript.getAttribute('user');

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 52.520008, lng: 13.404954 },
    zoom: 12,
  });
  getMapData();
  centerToCurrentLocation();
  if (user === 'true') {
    addStore();
  }
}

const getMapData = () => {
  axios
    // get JSON data
    .get('/mapdata')
    .then(function (response) {
      let mapData = response.data.stores;
      const icon = {
        url: './images/ice-cream-iconx50.png',
        size: new google.maps.Size(50, 75),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(30, 45),
      };

      for (let place of mapData) {
        // Loop through the results array and place a marker for each set of coordinates.
        const coords = place.location.coordinates;
        const latLng = new google.maps.LatLng(coords.lat, coords.lng);
        const marker = new google.maps.Marker({
          position: latLng,
          map: map,
          icon,
          title: place.name,
        });

        // create info window
        const infoString = `<div id="marker-content">
        <h4 id="store_title">${place.name}</h4>
        <p id="store_address">${place.address}</p>
        <form action="/view/${place._id}" method="GET">
          <button type="submit" id="view">View</button>
          </form>
        </div>`;

        marker.infowindow = new google.maps.InfoWindow();
        marker.infowindow.setContent(infoString);

        marker.addListener('click', () => {
          // close all open infowindows
          markers.forEach((marker) => marker.infowindow.close());
          // open new infowindow
          marker.infowindow.open(map, marker);
        });

        // display marker on map
        marker.setMap(map);
        markers.push(marker);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const centerToCurrentLocation = () => {
  locateWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement('button');
  locationButton.textContent = 'Go to Current Location';
  locationButton.classList.add('custom-map-control-button');
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(locationButton);
  locationButton.addEventListener('click', () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          locateWindow.setPosition(pos);
          locateWindow.setContent('Location found.');
          locateWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, locateWindow, map.getCenter());
        },
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, locateWindow, map.getCenter());
    }
  });
};

const addStore = () => {
  const input = document.getElementById('pac-input');

  // position search bar
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  // Specify just the place data fields that you need.
  autocomplete.setFields(['place_id', 'geometry', 'name']);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);

  const icon = {
    url: './images/blue-creme.png',
    size: new google.maps.Size(50, 75),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(30, 45),
  };

  const marker = new google.maps.Marker({
    map: map,
    icon,
  });

  marker.addListener('click', () => {
    infowindow.open(map, marker);
  });

  autocomplete.addListener('place_changed', () => {
    infowindow.close();
    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    // Set the position of the marker using the place ID and location.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location,
    });

    marker.setVisible(true);

    const addString = `<div id="marker-content">${place.name}<br>
    <form action="/add" method="POST">
      <input type='hidden' name='placeId' id='placeId' value="${place.place_id}">
      <input name='comments' id='comments' placeholder='Add comment here'>
      <button type="submit" id="submit">Add this store</button>
    </form>
    </div>`;

    infowindow.setContent(addString);
    infowindow.open(map, marker);
  });
};
