const isSignedIn = (req, res, next) => {
    if (req.session.user.isAdmin) return next();
    res.sendStatus(404);
  };
  
  module.exports = isSignedIn;