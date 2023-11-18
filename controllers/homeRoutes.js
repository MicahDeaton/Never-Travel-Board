const sequelize = require('../config/connection');
const router = require('express').Router();
const { User, Boards, Userstoboards } = require('../models');
const withAuth = require('../utils/auth');

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

router.get('/', withAuth, async (req, res) => {
  console.log('GET / ROUTE ===');
  try {
    const userData = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']],
    });

    const users = userData.map((project) => project.get({ plain: true }));

    res.render('homepage', {
      users,
      // Pass the logged in flag to the template
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get('/project/:id', async (req, res) => {
//   try {
//     const projectData = await Project.findByPk(req.params.id, {
//       include: [
//         {
//           model: User,
//           attributes: ['name'],
//         },
//       ],
//     });

//     const project = projectData.get({ plain: true });

//     res.render('project', {
//       ...project,
//       logged_in: req.session.logged_in
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

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

    //   await sequelize.query(
    //     'INSERT INTO `userstoboards` (`user_id`,`board_board_id`) VALUES (?,?)',
    //     {
    //       replacements: [i.user_id, i.board_board_id],
    //       type: QueryTypes.INSERT,
    //     }

    const boards = await sequelize.query(
      'SELECT * FROM boards JOIN userstoboards ON boards.board_id = userstoboards.board_board_id WHERE user_id=?',
      { replacements: [req.session.user_id], type: sequelize.QueryTypes.SELECT }
      //      { replacements: [req.sessionStore.user_id], type: QueryTypes.INSERT }
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
    if (req.session.board_id) {
      selectedboard = boards.find((i) => i.board_id === req.session.board_id);
    }
    console.log('\nafter find selected board: ---', selectedboard);

    res.render('profile', {
      ...user,
      boards,
      selectedboard,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
