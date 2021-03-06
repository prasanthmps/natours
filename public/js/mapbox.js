/*eslint-disable*/

console.log('Hello from client side');

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoibmFuZGFucmVkZHkiLCJhIjoiY2t2ZjhmMGgzMTBpaTJvcTVwMWRrZzRidSJ9.tyWG1xECczYsigK33DfVZw';

let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/nandanreddy/ckvf91uwj4u6u18rspsnrgxqk',
  scrollZoom: false
  //   center: [-115, 36],
  //   zoom: 4,
  //   interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  //Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  //Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  //Add popup
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day} :${loc.description}</p>`)
    .addTo(map);

  //Extend the map bounds to include currnet location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});
