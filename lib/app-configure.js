var express = require("express"),
    hogan = require("hogan-express"),
    less = require("less-middleware");

module.exports = function(app) {

    app.set("view engine", "html");
    app.set("layout", "layout");
    //app.enable "view cache"
    app.engine("html", hogan);

    app.use(express.logger());
    app.use(less({
        src: __dirname + "/../client"
    }));
    app.use(express.static(__dirname + "/../client"));
    app.use(express.static(__dirname + "/../bower_components"));

}

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));