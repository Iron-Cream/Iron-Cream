let map, infoWindow, storeInfo;
// let mapData = [];

function homeMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 52.520008, lng: 13.404954 },
    zoom: 10,
  });
  getMapData();

  // Loop through the results array and place a marker for each
  // set of coordinates.
}

function getMapData() {
  axios
    .get('/mapdata')
    .then(function (response) {
      // console.log(response.data.stores);
      let mapData = response.data.stores;
      console.log(mapData);
      for (let i = 0; i < mapData.length; i++) {
        const coords = mapData[i].location.coordinates;
        const latLng = new google.maps.LatLng(coords.lat, coords.lng);
        new google.maps.Marker({
          position: latLng,
          map: map,
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
