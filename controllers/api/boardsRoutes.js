const router = require('express').Router();
const { User, Boards, Userstoboards } = require('../../models');
const withAuth = require('../../utils/auth');
const withBoard = require('../../utils/withboard');

//   get all board data
router.get('/', withAuth, async (req, res) => {
  console.log('===== LIST ALL BOARDS =====');
  try {
    const boardsData = await Boards.findAll();

    res.status(200).json(boardsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//   return all users that owns this board
router.get('/users', withAuth, withBoard, async (req, res) => {
  console.log('===== LIST ALL USERS OF A BOARD =====');
  try {
    const boardsData = await Userstoboards.findAll({
      where: {
        board_board_id: req.session.board_id,
      },
    });

    res.status(200).json(boardsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/adduser', withAuth, withBoard, async (req, res) => {
  console.log('===== ADD A USER TO A BOARD =====');

  let selected_user_id;
  let returneduser;

  if (req.body.user_id) {
    // use the supplied user ID first if provided
    selected_user_id = req.body.user_id;
  } else if (req.body.user_name) {
    // no user id, but there is a user name, so try to look user id up by user name
    try {
      // Look up the user name
      console.log('Looking up ', req.body.user_name.toLowerCase());
      returneduser = await User.findOne({
        where: { name: req.body.user_name.toLowerCase() },
        attributes: ['id', 'name', 'email', 'isadmin'],
      });
      if (returneduser instanceof User) {
        // found the user id
        selected_user_id = returneduser.id;
      } else {
        // User not found
        res
          .status(404)
          .json({ message: 'Error looking up user id or user name' });
        return;
      }
    } catch (err) {
      res.status(404).json({
        message: `Error ${err} looking up user ${req.body.user_name}`,
      });
      return;
    }
  } else {
    // API call did not provide user_name nor user_id
    console.log(`No user info found in request`);
    res.status(404).json({ message: 'Please provide a user id or user name' });
    return;
  }

  // console.log(returneduser instanceof User); // true
  // console.log(returneduser);

  let userandboard;
  try {
    // Look up whether the user already owns the board
    userandboard = await Userstoboards.findOne({
      where: {
        user_id: selected_user_id,
        board_board_id: req.session.board_id,
      },
    });
  } catch (err) {
    res
      .status(404)
      .json({ message: 'Error while querying Userstoboards relationship' });
  }

  if (userandboard instanceof Userstoboards && userandboard.length() > 0) {
    res.status(304).json({ message: 'User already attached to that board' });
  } else {
    try {
      const newuseronboard = await Userstoboards.create({
        board_board_id: req.session.board_id,
        user_id: selected_user_id,
      });
      //res.status(200).json(newuseronboard);
      res.status(200).json({
        message: `User ${newuseronboard.user_id} added to board ${newuseronboard.board_board_id}`,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: `Error updating usertoboards with ${err}` });
    }
  }
});

//   get specific board by id
router.get('/:boardId', withAuth, async (req, res) => {
  console.log('===== LIST ONE BOARD =====');
  try {
    const boardData = await Boards.findByPk(req.params.boardId);

    res.status(200).json(boardData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a new board
router.post('/', withAuth, async (req, res) => {
  try {
    const newBoard = await Boards.create({
      board_name: req.body.board_name,
      board_description: req.body.board_description,
    });
    const newUserstoboardlink = await Userstoboards.create({
      board_board_id: newBoard.board_id,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBoard);
  } catch (err) {
    res.status(500).json(err);
  }
});

// select a board and save it as the default board being edited in the user session
router.post('/select/:boardId', withAuth, async (req, res) => {
  console.log('===== SELECT ONE BOARD =====');
  try {
    const boardData = await Boards.findByPk(parseInt(req.params.boardId));

    // save selected board ID into our session
    req.session.board_id = parseInt(req.params.boardId);
    console.log('Saving session board_id', req.session.board_id);
    req.session.save();

    res.status(200).json(boardData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update a board by id
router.put('/:boardId', withAuth, async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const updatedBoard = req.body;

    const [rowsUpdated, [updatedBoardData]] = await Boards.update(
      updatedBoard,
      {
        where: {
          board_id: boardId,
        },
        returning: true,
      }
    );

    if (rowsUpdated === 0) {
      res.status(404).json({ message: 'Board not found' });
    } else {
      res.status(200).json(updatedBoardData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a board
router.delete('/:boardId', withAuth, async (req, res) => {
  try {
    const boardData = await Boards.destroy({
      where: {
        board_id: req.params.boardId,
        // user_id: req.session.user_id,
      },
      include: User,
    });

    if (!boardData) {
      res.status(404).json({ message: 'No board found with this id!' });
      return;
    }

    res.status(200).json(boardData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
