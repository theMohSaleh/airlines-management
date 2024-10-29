const isAdminUser = (req, res, next) => {
    if (req.session.user.isAdmin) return next();
    res.render('errors/notFound.ejs');
  };
  
  module.exports = isAdminUser;