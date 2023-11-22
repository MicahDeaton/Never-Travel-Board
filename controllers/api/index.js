const router = require('express').Router();

const userRoutes = require('./userRoutes');
const boardsRoutes = require('./boardsRoutes');
const filtersRoutes = require('./filtersRoutes');
const locationRoutes = require('./locationRoutes');
// const projectRoutes = require('./projectRoutes');

router.use('/users', userRoutes);
router.use('/boards', boardsRoutes);
router.use('/filters', filtersRoutes);
router.use('/locations', locationRoutes);
// router.use('/projects', projectRoutes);

var myconfig = {
    UNSPLASH_API: 'hToCtEKI4Nj4xaC0jwg5Tva4DupP-vhbXhJ-mCiry5Y',
    GOOGLE_API: 'AIzaSyDAKGh9hM6lkhtz5MNmuUehgwnvtLVjYr8',
  };

module.exports = router;
