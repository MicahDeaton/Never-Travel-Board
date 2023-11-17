const router = require('express').Router();
const { User, Boards } = require('../../models');
const withAuth = require('../../utils/auth');

//   get all board data
  router.get('/api/boards', withAuth, async (req, res) => {
    try {
      const boardsData = await Boards.findAll();
  
      res.status(200).json(boardsData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// create a new board
  router.post('/api/boards', withAuth, async (req, res) => {
    try {
      const newBoard = await Boards.create({
        board_name: req.body.board_name,
        board_description: req.body.board_description,
      });
  
      res.status(200).json(newBoard);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//   update a board by id
router.put('/:boardId', withAuth, async (req, res) => {
    try {
      const boardId = req.params.boardId;
      const updatedBoard = req.body;
  
      const [rowsUpdated, [updatedBoardData]] = await Boards.update(updatedBoard, {
        where: {
          board_id: boardId,
        },
        returning: true,
      });
  
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
router.delete('/:BoardId', withAuth, async (req, res) => {
    try {
      const boardData = await Boards.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
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
