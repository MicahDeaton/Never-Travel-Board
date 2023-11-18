const router = require('express').Router();
const { Boards, Filters } = require('../../models');
const withAuth = require('../../utils/auth');
const withBoard = require('../../utils/withboard');

// get all filters in the database
//   get all board data
router.get('/', withAuth, async (req, res) => {
  console.log('===== LIST ALL FILTERS =====');
  try {
    const filters = await Filters.findAll();
    res.status(200).json(filters);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all filters by board ID
router.get('/byboard/:boardId', withAuth, async (req, res) => {
  try {
    const filters = await Filters.findAll({
      where: {
        board_id: req.params.boardId,
      },
      // include: Boards,
    });

    res.status(200).json(filters);
  } catch (err) {
    res.status(500).json(err);
  }
});

//   check if a filter exists on a board
router.get('/byname/:filterName', withAuth, async (req, res) => {
  try {
    const filter = await Filters.findOne({
      where: {
        //board_id: req.params.boardId,
        filter_name: req.params.filterName,
      },
    });

    if (filter) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//   create a single filter by filter name if it doesn't already exist on the board
router.post('/', withAuth, withBoard, async (req, res) => {
  console.log('Finding ', req.body.filter_name);
  if (!req.session.board_id) {
    console.log('you have not selected a board');
    res.status(404).json({ message: 'You have not selected a board' });
  } else {
    try {
      const filter = await Filters.findOne({
        where: {
          filter_name: req.body.filter_name,
          board_id: req.session.board_id,
        },
      });

      if (filter) {
        console.log('found filter!');
        res.status(200).json(filter);
      } else {
        console.log('not found filter!');
        const newFilter = await Filters.create({
          board_id: req.session.board_id,
          filter_name: req.body.filter_name,
        });
        res.status(200).json(newFilter);
      }

      // res.status(404).json({ message: 'Filter not found, creating one' });
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

// update a filter by the filter name
router.put('/:filterName', withAuth, withBoard, async (req, res) => {
  if (!req.session.board_id) {
    console.log('you have not selected a board');
    res.status(404).json({ message: 'You have not selected a board' });
  } else {
    try {
      const filterName = req.params.filterName;
      const updatedFilter = req.body;
      console.log('updating filter ', filterName);

      const [rowsUpdated, [updatedFilterData]] = await Filters.update(
        updatedFilter,
        {
          where: {
            filter_name: filterName,
            board_id: req.session.board_id,
          },
          returning: true,
        }
      );

      if (rowsUpdated === 0) {
        res.status(404).json({ message: 'Filter not found' });
      } else {
        res.status(200).json(updatedFilterData);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

//   delete a filter
router.delete('/:filterName', withAuth, withBoard, async (req, res) => {
  if (!req.session.board_id) {
    console.log('you have not selected a board');
    res.status(404).json({ message: 'You have not selected a board' });
  } else {
    try {
      const filterName = req.params.filterName;

      const rowsDeleted = await Filters.destroy({
        where: {
          filter_name: filterName,
          board_id: req.session.board_id,
        },
      });

      if (rowsDeleted === 0) {
        res.status(404).json({ message: 'No filter found with this name!' });
      } else {
        res.status(200).json({ message: 'Filter deleted successfully' });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

module.exports = router;
