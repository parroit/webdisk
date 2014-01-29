var express = require("express"),
    hogan = require("hogan-express"),
    passport = require("passport"),
    less = require("less-middleware"),
    fs = require("fs"),

    config = JSON.parse(fs.readFileSync(__dirname + "/../config/config.json"));

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

    app.config = config;
};

module.exports.config = config;

var strategy = require("./passport-strategy.js");

passport.use(strategy);