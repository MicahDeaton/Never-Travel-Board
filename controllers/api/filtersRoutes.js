const router = require('express').Router();
const { Boards, Filters } = require('../../models');
const withAuth = require('../../utils/auth');

// get all filters in the database
router.post('/', withAuth, async (req, res) => {
    try {
        const filters = await Filters.findAll();
        res.status(200).json(filters);
      } catch (err) {
        res.status(500).json(err);
      }
    });

// get all filters by board ID
router.get('/api/boards/:boardId/filters', withAuth, async (req, res) => {
    try {
      const filters = await Filters.findAll({
        where: {
          board_id: req.params.boardId,
        },
        include: Boards,
      });
  
      res.status(200).json(filters);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
//   check if a filter exists on a board
  router.get('/api/boards/:boardId/filters/:filterName', withAuth, async (req, res) => {
    try {
      const filter = await Filters.findOne({
        where: {
          board_id: req.params.boardId,
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

//   get a single filter by filter name
router.post('/:filterName', withAuth, async (req, res) => {
    try {
      const filterName = req.params.filterName;
      const filter = await Filters.findOne({
        where: {
          filter_name: filterName,
        },
      });
  
      if (filter) {
        res.status(200).json(filter);
      } else {
        res.status(404).json({ message: 'Filter not found' });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

// update a filter by the filter name
router.put('/:filterName', withAuth, async (req, res) => {
    try {
      const filterName = req.params.filterName;
      const updatedFilter = req.body;
  
      const [rowsUpdated, [updatedFilterData]] = await Filters.update(updatedFilter, {
        where: {
          filter_name: filterName,
        },
        returning: true,
      });
  
      if (rowsUpdated === 0) {
        res.status(404).json({ message: 'Filter not found' });
      } else {
        res.status(200).json(updatedFilterData);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

//   delete a filter
router.delete('/:filterName', withAuth, async (req, res) => {
    try {
      const filterName = req.params.filterName;
  
      const rowsDeleted = await Filters.destroy({
        where: {
          filter_name: filterName,
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
  });
  

  module.exports = router;
