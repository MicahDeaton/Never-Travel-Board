const selectBoardHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    let response;
    if (event.target.classList.contains('selectboard')) {
      event.preventDefault();
      // response = await fetch(`/api/boards/select/${id}`, {
      //   method: 'POST',
      // });

      // if (response.ok) {
      document.location.replace(`/boards/${id}`);
      // } else {
      //   alert('Failed to select board');
      // }
    }
  }
};

const searchHandler = async (event) => {
  event.preventDefault();

  const loc_to_search = document.querySelector('#wheretosearch').value.trim();
  const filter_to_search = document.querySelector('#whattosearch').value.trim();

  const cur_board_id =
    document.querySelector('#page_board_id').dataset.board_id;
  let selectgeo = document.getElementById('geometry');

  // alert(loc_to_search+' - '+filter_to_search+' - '+selectgeo.dataset.lat+','+selectgeo.dataset.lng);
  console.log(
    'search handler: ',
    loc_to_search,
    ' - ',
    filter_to_search,
    ' - ',
    selectgeo.dataset.lat,
    ',',
    selectgeo.dataset.lng
  );

  let fetchuri = `/api/locations/search?query=${filter_to_search}%20near%20${loc_to_search}&lat=${selectgeo.dataset.lat}&lng=${selectgeo.dataset.lng}&radius=10000`;

  try {
    const response = await fetch(fetchuri, {
      method: 'POST',
      body: '',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    if (response.ok) {
      document.location.replace(`/boards/${cur_board_id}`);
    } else {
      alert('Failed to create locations');
    }
  } catch (err) {
    alert('Error fetching ' + $fetchuri);
  }
};

// call directly on the button
// document.querySelector('#find-map').addEventListener('click', searchHandler);

document
  .querySelector('.board-list')
  .addEventListener('click', selectBoardHandler);

// Google map API
var map = null;

function initMap() {
  var lat = 30.2850329; // UT Austin, TX
  var lng = -97.7383881;
  var mapobj = {
    center: new google.maps.LatLng(lat, lng),
    zoom: 12,
  };
  if (document.getElementById('map')) {
    map = new google.maps.Map(document.getElementById('map'), mapobj);
  } else {
    // console.log("This page has no map");
  }
}

// Google autocomplete for search
// ------------------------------
// initialize google geocoder api after window has loaded
// var geocoder = new google.maps.Geocoder();

let autocomplete = null;

// initialize global variable autocomplete
function initializeautocomplete() {
  let myinput = document.getElementById('wheretosearch');
  autocomplete = new google.maps.places.Autocomplete(myinput);

  google.maps.event.clearInstanceListeners(autocomplete);
  google.maps.event.addListener(autocomplete, 'place_changed', () => {
    var place = autocomplete.getPlace();
    //center main map
    map.setCenter(place.geometry.location);
    console.log('autocomplete place: ', place);

    // per https://jsfiddle.net/upsidown/GVdK6/
    // https://stackoverflow.com/questions/62772109/how-to-create-a-google-address-autocomplete-search-box-with-additional-hidden-fi
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    var html = '<div id="boardlat" data-lat="'+ place.geometry.location.lat() + '">Latitude: ' + place.geometry.location.lat() + '</div>';
    html += '<div id="boardlng" data-lng="'+ place.geometry.location.lng() + '">Longitude: ' + place.geometry.location.lng() + '</div>';

    let selectgeo = document.getElementById('geometry');
    selectgeo.innerHTML = html;
    selectgeo.dataset.lat = place.geometry.location.lat();
    selectgeo.dataset.lng = place.geometry.location.lng();
  });
}

// /Google autocomplete for search
// ------------------------------

// Load initialization for Google API libraries
window.onload = () => {
  initializeautocomplete();
  initMap();
  let lat = document.getElementById('boardlat').dataset.lat;
  let lng = document.getElementById('boardlng').dataset.lng;
  map.setCenter(new google.maps.LatLng(lat, lng));
};
