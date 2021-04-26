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
    console.log(marker);
    marker.setVisible(true);

    const contentString = `<div id="marker-content">
    <form action="/map" method="POST">
      <input type='hidden' name='name' id='name' value="${marker.title}">
      <input type='hidden' name='lat' id='lat' value="${marker
        .getPosition()
        .lat()}">
      <input type='hidden' name='lng' id='lng' value="${marker
        .getPosition()
        .lng()}">
      <button type="submit">Add this store</button>
    </form>
    </div>`;

    infowindowContent.children.namedItem('place-name').textContent = place.name;
    infowindowContent.children.namedItem('place-id').textContent =
      place.place_id;
    infowindowContent.children.namedItem('place-address').textContent =
      place.formatted_address;
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

function initAutocomplete() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 52.520008, lng: 13.404954 },
    zoom: 10,
  });

  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  autocomplete.setFields(['place_id', 'geometry', 'name']);
  // console.log(autocomplete);

  infoWindow = new google.maps.InfoWindow();
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

  // Create the search box and link it to the UI element.
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', () => {
    searchBox.setBounds(map.getBounds());
  });
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];
    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log('Returned place contains no geometry');
        return;
      }
      const icon = {
        // url: place.icon,
        url: './images/ice-cream-iconx50.png',
        size: new google.maps.Size(50, 75),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(30, 45),
      };
      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        }),
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    // store info
    const contentString = `<div id="content">
    ${markers[0].title}
    <form action="/map" method="POST">
      <input type='hidden' name='name' id='name' value="${markers[0].title}">
      <input type='hidden' name='lat' id='lat' value="${markers[0]
        .getPosition()
        .lat()}">
      <input type='hidden' name='lng' id='lng' value="${markers[0]
        .getPosition()
        .lng()}">
      <button type="submit">Add this store</button>
    </form>
    </div>`;

    storeInfo = new google.maps.InfoWindow({
      content: contentString,
    });
    const pos = {
      lat: markers[0].getPosition().lat() + 0.00025,
      lng: markers[0].getPosition().lng(),
    };
    storeInfo.setPosition(pos);
    storeInfo.setContent(contentString);
    storeInfo.open(map);

    // console.log(markers[0]);
    map.fitBounds(bounds);
  });
}
