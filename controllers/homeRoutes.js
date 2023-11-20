const sequelize = require('../config/connection');
const router = require('express').Router();
const { User, Boards, Userstoboards, Locations } = require('../models');
const withAuth = require('../utils/auth');
const withBoard = require('../utils/withboard');

// router.get('/', async (req, res) => {
//   try {
//     // Get all projects and JOIN with user data
//     const boardsData = await Boards.findAll({
//       include: [
//         {
//           model: Users,
//           attributes: ['name'],
//         },
//       ],
//     });

//     // Serialize data so the template can read it
//     const allboards = boardsData.map((allboards) => allboards.get({ plain: true }));

//     console.log("All Boards:\n", allboards);
//     // Pass serialized data and session flag into template
//     res.render('homepage', {
//       allboards,
//       logged_in: req.session.logged_in
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

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

// Board page
// ----------
router.get('/boards', withAuth, withBoard, async (req, res) => {
  try {
    const boards = await sequelize.query(
      'SELECT * FROM boards JOIN userstoboards ON boards.board_id = userstoboards.board_board_id WHERE user_id=?',
      { replacements: [req.session.user_id], type: sequelize.QueryTypes.SELECT }
    );
    console.log(boards);

    req.session.board_id = parseInt(req.params.boardId);
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

    res.render('boards', {
      name: boards,
      selectedboard,
      locations,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Boards explorer page
// --------------------
router.get('/boards/:boardId', withAuth, withBoard, async (req, res) => {
  try {
    console.log('\nBOARDID PARAM: ', req.params.boardId);
    const boardId = parseInt(req.params.boardId);
    //TBD: validate board ID received from params and check if user owns the board
    console.log('\nsetting board from param: ---', boardId);
    req.session.board_id = boardId; // set the currently selected board
    req.session.save();

    console.log('\nUSER: ----------', req.session.user_id);
    let userq = await sequelize.query(
      'SELECT name,email,isadmin FROM user WHERE id=?',
      {
        replacements: [req.session.user_id],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    console.log('\nUSER: ----------', userq[0]);
    let currentuser = userq[0];

    const boards = await sequelize.query(
      'SELECT * FROM boards JOIN userstoboards ON boards.board_id = userstoboards.board_board_id WHERE user_id=?',
      { replacements: [req.session.user_id], type: sequelize.QueryTypes.SELECT }
    );
    console.log('\nBoards: ', boards);

    let selectedboard;
    let locations;
    if (boardId !== 0) {
      selectedboard = boards.find((i) => i.board_id === boardId);
      console.log('\nselectedboard: ---', selectedboard);

      // If a board is selected, get all the selected locations for that board
      locations = await sequelize.query(
        'SELECT * FROM locations WHERE board_id=?',
        { replacements: [boardId], type: sequelize.QueryTypes.SELECT }
      );
      console.log('\nLocations of selected board:', locations);
    }

    const filters = await sequelize.query(
      'SELECT filter_name FROM filters WHERE board_id = ?',
      { replacements: [boardId], type: sequelize.QueryTypes.SELECT }
    );
    console.log('FILTERS: --- ', filters);

    res.render('boards', {
      boards,
      selectedboard,
      locations,
      filters,
      currentuser,
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

    res.render('profile', {
      ...user,
      boards,
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
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
