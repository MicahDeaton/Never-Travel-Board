const sequelize = require('../config/connection');
const router = require('express').Router();
const { User, Boards, Userstoboards, Locations } = require('../models');
const withAuth = require('../utils/auth');
const withBoard = require('../utils/withboard');

// // Board page
// // ----------
// router.get('/boards', withAuth, withBoard, async (req, res) => {
//   try {
//     const boards = await sequelize.query(
//       'SELECT * FROM boards JOIN userstoboards ON boards.board_id = userstoboards.board_board_id WHERE user_id=?',
//       { replacements: [req.session.user_id], type: sequelize.QueryTypes.SELECT }
//     );
//     console.log(boards);

//     //req.session.board_id = parseInt(req.params.boardId);
//     console.log('\nselected board: ---', req.session.board_id);
//     let selectedboard;
//     let locations;
//     if (req.session.board_id) {
//       if (req.session.board_id != 0) {
//         selectedboard = boards.find((i) => i.board_id === req.session.board_id);

//         // If a board is selected, get all the selected locations for that board
//         locations = await sequelize.query(
//           'SELECT * FROM locations WHERE board_id=?',
//           {
//             replacements: [req.session.board_id],
//             type: sequelize.QueryTypes.SELECT,
//           }
//         );
//         console.log('\nLocations of selected board:', locations);
//       }
//     }

//     res.render('boards', {
//       name: boards,
//       selectedboard,
//       locations,
//       logged_in: req.session.logged_in,
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get('/boards', withAuth, withBoard, async (req, res) => {
  try {
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
    if (req.session.board_id && req.session.board_id !== 0) {
      selectedboard = boards.find((i) => i.board_id === req.session.board_id);
      console.log('\nselectedboard: ---', selectedboard);

      // If a board is selected, get all the selected locations for that board
      locations = await sequelize.query(
        'SELECT * FROM locations WHERE board_id=?',
        { replacements: [boardId], type: sequelize.QueryTypes.SELECT }
      );
      console.log('\nLocations of selected board:', locations);
    } else {
      console.log("No boards selected");
    }

    let boardlist = boards.map( (i) => {
      return i.board_id;
    });
    console.log("all boards ", boardlist);

    const filters = await sequelize.query(
      'SELECT filter_name FROM filters WHERE board_id IN (:boardlist)',
      { replacements: { boardlist }, type: sequelize.QueryTypes.SELECT }
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

    const allsharedusers = await sequelize.query(
      'SELECT * FROM user JOIN userstoboards ON user.id = userstoboards.user_id WHERE board_board_id=?',
      { replacements: [req.session.board_id], type: sequelize.QueryTypes.SELECT }
    );
    let sharedusers = allsharedusers.filter( (i) => {
      return i.id !== req.session.user_id; 
    });
    console.log('\nAll other users sharing this board: ', sharedusers);

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

    // Get all the board's filters from the database
    const filters = await sequelize.query(
      'SELECT filter_name FROM filters WHERE board_id = ?',
      { replacements: [boardId], type: sequelize.QueryTypes.SELECT }
    );
    console.log('FILTERS: --- ', filters);

    res.render('boards', {
      boards,
      sharedusers,
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

module.exports = router;
