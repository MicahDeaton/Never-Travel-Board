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
    const boardData = await Boards.findByPk(req.params.boardId);

    // save selected board ID into our session
    req.session.board_id = parseInt(req.params.boardId);
    console.log('Saving session board_id', req.session.board_id);
    req.session.save(() => {
      res.status(200).json(boardData);
    });
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
