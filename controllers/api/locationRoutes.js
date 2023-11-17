const router = require('express').Router();
const { Locations } = require('../../models');
const withAuth = require('../../utils/auth');
const withBoard = require('../../utils/withboard');

// GET all locations
router.get('/', withAuth, async (req, res) => {
  try {
    console.log('Getting all locations by the user ', req.session.user_id);
    let selection = {};
    // select only locations for selected board
    if (req.session.board_id) {
      selection = {
        where: {
          board_id: req.session.board_id,
        },
      };
    }
    const locationsData = await Locations.findAll(selection);
    res.status(200).json(locationsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a specific location
router.get('/:locationId', withAuth, async (req, res) => {
  try {
    console.log('Getting location  ', req.params.locationId);
    const locationsData = await Locations.findbyPk(req.params.locationId);
    res.status(200).json(locationsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// creates a location
router.post('/', withAuth, withBoard, async (req, res) => {
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

// update a filter by the filter name
router.put('/:locationId', withAuth, withBoard, async (req, res) => {
  try {
    const updatedLocation = req.body;
    console.log('updating location ', req.params.locationId);

    const [rowsUpdated, [updatedLocationData]] = await Locations.update(
      updatedLocation,
      {
        where: {
          location_id: req.params.locationId,
          board_id: req.session.board_id,
        },
        returning: true,
      }
    );

    if (rowsUpdated === 0) {
      res.status(404).json({ message: 'Location not found' });
    } else {
      res.status(200).json(updatedLocationData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:locationId', withAuth, withBoard, async (req, res) => {
  try {
    const locationsData = await Locations.destroy({
      where: {
        location_id: req.params.locationId,
        board_id: req.session.board_id,
      },
    });

    if (!locationsData) {
      res.status(404).json({
        message: `Failed to delete location ${req.params.locationId} on board ${req.session.board_id}`,
      });
      return;
    }

    res.status(200).json(locationsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
