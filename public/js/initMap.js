let map, locateWindow;
let markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 52.520008, lng: 13.404954 },
    zoom: 12,
  });
  getMapData();
  centerToCurrentLocation();
}

const getMapData = () => {
  axios
    // get JSON data
    .get('/mapdata')
    .then(function (response) {
      let mapData = response.data.stores;
      // console.log(mapData);
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
        ${place.name}<br>
        <form action="/view/${place._id}" method="POST">
          <input type='hidden' name='name' id='name' value="${place.name}">
          <input type='hidden' name='id' id='id' value="${place._id}">
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
    console.log('clicked');
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
