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

document
  .querySelector('.board-list')
  .addEventListener('click', selectBoardHandler);

// // Google autocomplete for search
// // ------------------------------
// // initialize google geocoder api after window has loaded
// //var geocoder = new google.maps.Geocoder();

// var autocomplete = null;

// // initialize global variable autocomplete
// function initializeautocomplete() {
//   var input = document.getElementById('whattosearch');
//   autocomplete = new google.maps.places.Autocomplete(input);

//   google.maps.event.clearInstanceListeners(autocomplete);
//   google.maps.event.addListener(autocomplete, 'place_changed', () => {
//     var place = autocomplete.getPlace();
//     // center main map
//     // map.setCenter(place.geometry.location);
//     // console.log("autocomplete place: ",place);

//     // per https://jsfiddle.net/upsidown/GVdK6/
//     // https://stackoverflow.com/questions/62772109/how-to-create-a-google-address-autocomplete-search-box-with-additional-hidden-fi
//     if (!place.geometry) {
//       // User entered the name of a Place that was not suggested and
//       // pressed the Enter key, or the Place Details request failed.
//       window.alert("No details available for input: '" + place.name + "'");
//       return;
//     }

//     var html = '<div>Latitude: ' + place.geometry.location.lat() + '</div>';
//     html += '<div>Longitude: ' + place.geometry.location.lng() + '</div>';

//     document.getElementById('geometry').innerHTML = html;
//   });
// }

// window.onload = (event) => {
//   initializeautocomplete();
// };
// // /Google autocomplete for search
// // ------------------------------
