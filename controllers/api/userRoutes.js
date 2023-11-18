const router = require('express').Router();
const { User, Userstoboards } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.board_id = 0;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//   return all boards that this user owns
router.get('/boards', withAuth, async (req, res) => {
  console.log('===== LIST ALL BOARDS OF A USER =====');
  try {
    const boardsData = await Userstoboards.findAll({
      where: {
        user_id: req.session.user_id,
      },
    });

    res.status(200).json(boardsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/boards', withAuth, async (req, res) => {
  console.log('===== ASSIGNS A NEW BOARD TO A USER =====', req.body, req.session.user_id);
  try {
    const boardsData = await Userstoboards.create({
      board_board_id: req.body.board_id,
      user_id: req.session.user_id,
    });

    res.status(200).json(boardsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
