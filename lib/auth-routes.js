var passport = require("passport");

exports.postLogin = passport.authenticate("local", {
    successRedirect: "/files",
    failureRedirect: "/login",
    failureFlash: true 
});

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
}