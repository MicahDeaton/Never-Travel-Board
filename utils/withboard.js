const withBoard = (req, res, next) => {
    // If the user has not selected a board, redirect the request to the profile page so the user can select a board
    if (!req.session.logged_in) {
      res.redirect('/profile');
    } else {
      next();
    }
  };
  
  module.exports = withBoard;
  