const router = require('express').Router();
const { Locations } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all locations
router.get('/', withAuth, async (req, res) => {
  try {
    const locationsData = await Locations.findAll();
    console.log('LOCATIONS GET: ', JOSN.stringify(locationsData));
    res.status(200).json(locationsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {
  try {
    const createdLocations = await Locations.create({
      ...req.body,
      user_id: req.session.user_id,
      board_id: req.session.board_id,
    });

    res.status(200).json(createdLocations);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const locationsData = await Locations.destroy({
      where: {
        location_id: req.params.location_id,
        user_id: req.session.user_id,
        board_id: req.session.board_id,
      },
    });

    if (!locationsData) {
      res
        .status(404)
        .json({
          message: `Failed to delete location ${req.params.location_id} on board ${req.session.board_id}`,
        });
      return;
    }

    res.status(200).json(locationsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
