let map, infoWindow, storeInfo;
const input = document.getElementById('pac-input');
let markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 52.520008, lng: 13.404954 },
    zoom: 10,
  });

  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  // Specify just the place data fields that you need.
  autocomplete.setFields(['place_id', 'geometry', 'name']);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);

  const icon = {
    url: './images/ice-cream-iconx50.png',
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
    console.log(place);

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

    const contentString = `<div id="marker-content">
    ${place.name}<br>
    <form action="/map" method="POST">
      <input type='hidden' name='name' id='name' value="${place.name}">
      <input type='hidden' name='placeId' id='placeId' value="${place.place_id}">
      <input type='hidden' name='location' id='location' value="${place.geometry.location}">
      <button type="submit" id="submit">Add this store</button>
    </form>
    </div>`;

    infowindow.setContent(contentString);
    infowindow.open(map, marker);
  });

  // center map on user location
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
          infoWindow.setPosition(pos);
          infoWindow.setContent('Location found.');
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        },
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}
