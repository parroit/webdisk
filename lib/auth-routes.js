var passport = require("passport");

exports.postLogin = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true 
});