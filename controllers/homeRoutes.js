const globconfig = require('../config/config');
const sequelize = require('../config/connection');
const router = require('express').Router();
const { User, Boards, Userstoboards, Locations } = require('../models');
const withAuth = require('../utils/auth');
const withBoard = require('../utils/withboard');

// Main page: all users, boards, and locations table
// -------------------------------------------------
router.get('/', withAuth, async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']],
    });

    const locationlist = await sequelize.query(
      'SELECT locations.location_name,locations.location_imageurl,locations.location_notes,boards.board_name,boards.board_description,user.name FROM locations INNER JOIN boards ON boards.board_id = locations.board_id INNER JOIN userstoboards ON userstoboards.board_board_id = boards.board_id INNER JOIN user ON user.id = userstoboards.user_id',
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log(locationlist);

    res.render('homepage', {
      locationlist,
      // Pass the logged in flag to the template
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// User profile page
// -----------------
// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      // include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });
    console.log(user);

    // Find all boards for this user
    const boards = await sequelize.query(
      'SELECT * FROM boards JOIN userstoboards ON boards.board_id = userstoboards.board_board_id WHERE user_id=?',
      { replacements: [req.session.user_id], type: sequelize.QueryTypes.SELECT }
    );
    // const boardsData = await Boards.findAll({
    //   include: [{ model: User }],
    //   // attributes: ['board_board_id'],
    //   // where: {
    //   //   user_id: req.session.user_id,
    //   // },
    // });

    //const boards = boardsData.map((boards) => boards.get({ plain: true }));
    console.log(boards);

    console.log('\nselected board: ---', req.session.board_id);
    let selectedboard;
    let locations;
    if (req.session.board_id) {
      if (req.session.board_id != 0) {
        selectedboard = boards.find((i) => i.board_id === req.session.board_id);

        // If a board is selected, get all the selected locations for that board
        locations = await sequelize.query(
          'SELECT * FROM locations WHERE board_id=?',
          {
            replacements: [req.session.board_id],
            type: sequelize.QueryTypes.SELECT,
          }
        );
        console.log('\nLocations of selected board:', locations);
      }
    }

    let hasdelete = true;

    res.render('profile', {
      ...user,
      boards,
      hasdelete,
      selectedboard,
      locations,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login page
// ----------
router.get('/login', async (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  // get some random pictures from unsplash
  const term = 'travel';
  let apiUrl = `https://api.unsplash.com/photos/random?query=${term}&orientation=portrait&count=8&per_page=1&client_id=${globconfig.UNSPLASH_API}`;
  console.log(apiUrl);

  let randompics;
  let locations;

  try {
    let unsplash_fetch = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        // Origin: 'null', // cors-anywhere proxy needs this
        // 'Accept-Language': 'en, *',
        Accept: 'application/json',
      },
    });
    randompics = await unsplash_fetch.json();
    console.log('result: ', randompics);

    // convert the Unsplash API to a locations array object
    locations = randompics.map((i) => {
      let loc = {
        location_name: '',
        location_imageurl: '',
        location_link: '',
        latitude: null,
        longitude: null,
      };
      if (i.location && i.location.name) {
        loc.location_name = i.location.name;
      } else if (i.description && (i.description.length < 32)) {
        loc.location_name = i.description;
      } else if (i.alt_description && (i.alt_description.length < 32)) {
        loc.location_name = i.alt_description;
      } else {
        loc.location_name = i.slug;
      }
      loc.location_name = loc.location_name.substring(0, 32);

      if (i.links && i.links.html) {
        loc.location_link = i.links.html;
      }
      if (i.location.position.latitude) {
        loc.latitude = i.location.position.latitude;
      }
      if (i.location.position.longitude) {
        loc.longitude = i.location.position.longitude;
      }
      loc.location_imageurl = i.urls.thumb; // .thumb, .small, .full, .raw 

      return loc;
    });

    res.status(200);
  } catch (err) {
    console.log('error in fetch() to unsplash on /login', err);
    res
      .status(404)
      .json({ error: 'error in fetch() to unsplash on /login', message: err });
    return;
  }

  console.log('random pics: ', locations
  
  
  );

  res.render('login', { locations });
});

module.exports = router;
