const sequelize = require('../../config/connection');
const router = require('express').Router();
const { Boards, Locations, Placetypes } = require('../../models');
const withAuth = require('../../utils/auth');
const withBoard = require('../../utils/withboard');

var myconfig = {
  UNSPLASH_API: 'hToCtEKI4Nj4xaC0jwg5Tva4DupP-vhbXhJ-mCiry5Y',
  GOOGLE_API: 'AIzaSyDAKGh9hM6lkhtz5MNmuUehgwnvtLVjYr8',
};


// GET all locations
router.get('/', withAuth, async (req, res) => {
  try {
    console.log('Getting all locations by the user ', req.session.user_id);
    let selection = {};
    // select only locations for selected board
    if (req.session.board_id) {
      selection = {
        where: {
          board_id: req.session.board_id,
        },
      };
    }
    const locationsData = await Locations.findAll(selection);
    res.status(200).json(locationsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// initiates a location search, and returns the search results
router.get('/search', withAuth, withBoard, async (req, res) => {
  try {
    // req.params for POST to this route should include:
    //   lat: FLOAT
    //   lng: FLOAT
    //   radius: FLOAT (optional)
    //   query: STRING
    //   type: STRING  - a place type (optional)
    console.log('PARAMETERS: ', req.query);

    // Google Place API documentation
    // https://developers.google.com/maps/documentation/places/web-service/place-id
    //   Example: https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJ05IRjKHxEQ0RJLV_5NLdK2w&fields=place_id&key=YOUR_API_KEY

    // Text Search <=== this is the one we're using
    // https://developers.google.com/maps/documentation/places/web-service/search-text#maps_http_places_textsearch-sh
    //   Example: https://maps.googleapis.com/maps/api/place/textsearch/json?query=museums%20near%20paris,%20france&location=48.858863%27%2C%272.19132151&radius=10000&key=AIzaSyDAKGh9hM6lkhtz5MNmuUehgwnvtLVjYr8

    // Place Photo API --- to get the image URLs
    //   Example: curl -v -L -X GET 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=ATJ83zgjwIr7QgnwAzhRmWt9sS1vo3_T7vARZ0Q-rpyE0_C0cYXKp8TU26Kyox_uM1JZrjkPtoQUORW4cZrI9njShYAArFUVvWvIdITXAKVtJVVZ9naigktLd9L88nLDgSAA6kaZqzkgzDuKIn98zwCqaDE9KFXbxZUcDfEsNRVpRbRqTz4d&key=YOUR_API_KEY'

    // Search from the default search term
    let searchterm = req.query.query.trim();
    if (searchterm.length === 0) {
      searchterm = 'tourist attractions';
    }
    console.log('SEARCH TERMS: ', searchterm);

    let apiUrl =
      'https://maps.googleapis.com/maps/api/place/textsearch/json?' + // This gives a CORS error
      //'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
      `query=${req.query.query}` +
      `&location=${req.query.lat}'%2C'${req.query.lng}` +
      `&radius=${req.query.radius}` +
      `&key=${myconfig.GOOGLE_API}`;

    console.log('will fetch ', apiUrl);

    let google_locations;

    try {
      let google_fetch = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          // Origin: 'null', // cors-anywhere proxy needs this
          // 'Accept-Language': 'en, *',
          Accept: 'application/json',
        },
      });
      google_locations = await google_fetch.json();
      console.log('result: ', google_locations);
    } catch (err) {
      console.log('error in fetch()');
      res.status(404).json({ error: 'error in fetch()' });
      return;
    }

    console.log('\n\nmapping google locations\n\n');

    let foundtypes = [];

    // translate into our Locations model table columns
    let createdLocations = google_locations.results.map((i) => {
      console.log('i: ', JSON.stringify(i));

      // list all found types
      i.types.forEach((a) => {
        if (!foundtypes.find((b) => b === a)) foundtypes.push(a);
      });

      let imageurl = '/favicon.ico';
      if (i.photos && i.photos[0].photo_reference) {
        imageurl =
          'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' +
          i.photos[0].photo_reference +
          '&key=' +
          myconfig.GOOGLE_API;
      }

      return {
        location_name: i.name,
        location_imageurl: imageurl,
        formatted_address: i.formatted_address,
        google_placeid: i.place_id,
        icon: i.icon,
        icon_background_color: i.icon_background_color,
        icon_mask_base_uri: i.icon_mask_base_uri,
        rating: i.rating,
        user_ratings_total: i.user_ratings_total,
        latitude: i.geometry.location.lat,
        longitude: i.geometry.location.lng,
      };
    });

    console.log('mapped result: ', createdLocations);
    console.log('all types: ', foundtypes);

    //const createdLocations = { your_request: JSON.stringify(req.query) };
    // const createdLocations = await Locations.create({
    //   ...req.body,
    //   user_id: req.session.user_id,
    //   board_id: req.session.board_id,
    // });

    let respobj = { locations: createdLocations, foundtypes: foundtypes };
    console.log(
      'RESPONSE OBJ: ',
      respobj,
      ' length:',
      respobj.locations.length
    );
    //console.log(`Successfully added ${respobj.locations.length} locations`);

    //res.status(200).json({ msg: `Successfully found ${respobj.locations.length} locations` });
    res.status(200).json({
      msg: `Successfully found ${respobj.locations.length} locations`,
      ...respobj,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// populate location database with new locations from the API
router.post('/search', withAuth, withBoard, async (req, res) => {
  let google_locations;

  try {
    // req.params for POST to this route should include:
    //   lat: FLOAT
    //   lng: FLOAT
    //   radius: FLOAT (optional)
    //   query: STRING
    //   type: STRING  - a place type (optional)
    console.log('PARAMETERS: ', req.query);

    // Google Place API documentation
    // https://developers.google.com/maps/documentation/places/web-service/place-id
    //   Example: https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJ05IRjKHxEQ0RJLV_5NLdK2w&fields=place_id&key=YOUR_API_KEY

    // Text Search <=== this is the one we're using
    // https://developers.google.com/maps/documentation/places/web-service/search-text#maps_http_places_textsearch-sh
    //   Example: https://maps.googleapis.com/maps/api/place/textsearch/json?query=museums%20near%20paris,%20france&location=48.858863%27%2C%272.19132151&radius=10000&key=AIzaSyDAKGh9hM6lkhtz5MNmuUehgwnvtLVjYr8

    // Place Photo API --- to get the image URLs
    //   Example: curl -v -L -X GET 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=ATJ83zgjwIr7QgnwAzhRmWt9sS1vo3_T7vARZ0Q-rpyE0_C0cYXKp8TU26Kyox_uM1JZrjkPtoQUORW4cZrI9njShYAArFUVvWvIdITXAKVtJVVZ9naigktLd9L88nLDgSAA6kaZqzkgzDuKIn98zwCqaDE9KFXbxZUcDfEsNRVpRbRqTz4d&key=YOUR_API_KEY'

    // Search from the default search term
    let searchterm = req.query.query.trim();
    if (searchterm.length === 0) {
      searchterm = 'tourist attractions'; // default search term. TBD: put it in a main config
    }
    console.log('SEARCH TERMS: ', searchterm);

    let apiUrl =
      'https://maps.googleapis.com/maps/api/place/textsearch/json?' + // This gives a CORS error
      //'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
      `query=${req.query.query}` +
      `&location=${req.query.lat}'%2C'${req.query.lng}` +
      `&radius=${req.query.radius}` +
      `&key=${myconfig.GOOGLE_API}`;

    console.log('will fetch ', apiUrl);

    try {
      let google_fetch = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          // Origin: 'null', // cors-anywhere proxy needs this
          // 'Accept-Language': 'en, *',
          Accept: 'application/json',
        },
      });
      google_locations = await google_fetch.json();
      console.log('result: ', google_locations);
    } catch (err) {
      console.log('error in fetch()');
      res.status(404).json({ error: 'error in fetch()' });
      return;
    }

    console.log('\n\niterating google locations\n\n');

    // translate into our Locations model table columns
    for (let i of google_locations.results) {
      console.log('post i: ', JSON.stringify(i));

      let imageurl = '/favicon.ico';
      if (i.photos && i.photos[0].photo_reference) {
        imageurl =
          'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' +
          i.photos[0].photo_reference +
          '&key=' +
          myconfig.GOOGLE_API;
      }



      let loc_element = {
        location_name: i.name,
        location_imageurl: imageurl,
        formatted_address: i.formatted_address,
        google_placeid: i.place_id,
        icon: i.icon,
        icon_background_color: i.icon_background_color,
        icon_mask_base_uri: i.icon_mask_base_uri,
        rating: i.rating,
        user_ratings_total: i.user_ratings_total,
        latitude: i.geometry.location.lat,
        longitude: i.geometry.location.lng,
        board_id: req.session.board_id,
      };

      try {
        let newLocation = await Locations.create({
          ...loc_element,
        });
        console.log('LOCATION ID: ', newLocation.location_id);

        for (let ltype of i.types) {
          try {
            let newtype = await Placetypes.create({
              location_id: newLocation.location_id,
              typestr: ltype,
              source: 1,
            });
            console.log('New Type: ', newtype);
          } catch (err) {
            console.log('Error inserting location types: ', err);
          }
        }
      } catch (err) {
        console.log('Error creating a new location: ', err);
      }
    }

    //console.log('mapped result: ', createdLocations);

    //const createdLocations = { your_request: JSON.stringify(req.query) };
    // const createdLocations = await Locations.create({
    //   ...req.body,
    //   user_id: req.session.user_id,
    //   board_id: req.session.board_id,
    // });

    // store current searched location in board database  =-=-=-=-=-=-
    const updatedBoard = {
      lat: parseFloat(req.query.lat),
      lng: parseFloat(req.query.lng),
      radius: parseInt(req.query.radius),
      search: req.query.query,
    };

    console.log(
      'updating board: ----------------',
      updatedBoard,
      ' - ',
      req.session.board_id,
      ' - ',
      typeof updatedBoard
    );

    // const [rowsUpdated, [updatedBoardData]] = await Boards.update( ...updatedBoard, {
    //   where: {
    //     board_id: req.session.board_id,
    //   },
    //   returning: true,
    // });

    // console.log("update results rows: ", rowsUpdated, " - ", updatedBoardData);

    // if (rowsUpdated === 0) {
    //   res.status(404).json({ message: `Error updating board ${req.session.board_id}` });
    // } else {
    //   res.status(200).json(updatedBoardData);
    // }

    // If a board is selected, get all the selected locations for that board
    locations = await sequelize.query(
      'UPDATE boards SET lat = ?, lng = ?, radius = ?, search = ? WHERE board_id=?',
      {
        replacements: [
          updatedBoard.lat,
          updatedBoard.lng,
          updatedBoard.radius,
          updatedBoard.search,
          req.session.board_id
        ],
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    console.log('\nLocations of selected board:', locations);

    // finish updating board with search criteria

    console.log(
      'POST Success ========================================================================='
    );

    res.status(200).json({
      msg: `Successfully added ${google_locations.results.length} locations`,
      ...google_locations.results,
    });
  } catch (err) {
    console.log(
      'POST Error =========================================================================',
      err
    );
    res.status(400).json(err);
  }
});

// GET a specific location
router.get('/:locationId', withAuth, async (req, res) => {
  try {
    console.log('Getting location  ', req.params.locationId);
    const locationsData = await Locations.findbyPk(req.params.locationId);
    res.status(200).json(locationsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// creates a location
router.post('/', withAuth, withBoard, async (req, res) => {
  try {
    const createdLocations = await Locations.create({
      ...req.body,
      user_id: req.session.user_id,
      board_id: req.session.board_id,
    });

    res.status(200).json(createdLocations);
  } catch (err) {
    res.status(400).json(err);
  }
});

// update a filter by the filter name
router.put('/:locationId', withAuth, withBoard, async (req, res) => {
  try {
    const updatedLocation = req.body;
    console.log('updating location ', req.params.locationId);

    const [rowsUpdated, [updatedLocationData]] = await Locations.update(
      updatedLocation,
      {
        where: {
          location_id: req.params.locationId,
          board_id: req.session.board_id,
        },
        returning: true,
      }
    );

    if (rowsUpdated === 0) {
      res.status(404).json({ message: 'Location not found' });
    } else {
      res.status(200).json(updatedLocationData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:locationId', withAuth, withBoard, async (req, res) => {
  try {
    const locationsData = await Locations.destroy({
      where: {
        location_id: req.params.locationId,
        board_id: req.session.board_id,
      },
    });

    if (!locationsData) {
      res.status(404).json({
        message: `Failed to delete location ${req.params.locationId} on board ${req.session.board_id}`,
      });
      return;
    }

    res.status(200).json(locationsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
