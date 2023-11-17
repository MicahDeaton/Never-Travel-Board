const router = require('express').Router();
const userRoutes = require('./userRoutes');
const boardsRoutes = require('./boardsRoutes');
const filtersRoutes = require('./filtersRoutes');
// const projectRoutes = require('./projectRoutes');

router.use('/users', userRoutes);
router.use('./boards', boardsRoutes);
router.use('./filters', filtersRoutes);
// router.use('/projects', projectRoutes);

module.exports = router;
