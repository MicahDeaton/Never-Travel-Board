const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');

// https://expressjs.com/en/api.html#req
// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function (req, res, next) {
  console.log('%s %s %s === ROUTE LOG ===', req.method, req.url, req.path);
  console.log(req.session.user_id);
  console.log(req.session.logged_in);
  console.log(req.session);
  next();
});

router.use('/', homeRoutes);
router.use('/api', apiRoutes);

module.exports = router;
