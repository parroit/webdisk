var express = require("express"),
    hogan = require("hogan-express"),
    passport = require("passport"),
    flash = require('connect-flash'),
    less = require("less-middleware"),
    prettyErrorHandler = require("./pretty-error-handler/index"),


    SessionDiskStore = require("./session-disk-store")(express.session.Store),
    fs = require("fs"),

    config = JSON.parse(fs.readFileSync(__dirname + "/../config/config.json"));

module.exports = function(app) {

    /*****************
     * view
     *****************/
    app.set("view engine", "html");
    app.set("layout", "layout");
    //app.enable "view cache"
    app.engine("html", hogan);

    /*****************
     * base
     *****************/

    app.use(prettyErrorHandler.handleErrorEvent);

    app.use(express.logger(config.logger));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({
        secret: config.auth.cookieSecret,
        store: new SessionDiskStore(config.sessions)
    }));
    app.use(flash());
    

    

    /*****************
     * assets
     *****************/
    app.use(less({
        src: __dirname + "/../client"
    }));
    app.use(express.static(__dirname + "/../client"));
    app.use(express.static(__dirname + "/../bower_components"));

    /*****************
     * passport
     *****************/

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(app.router);
    
    /*****************
     * errors management
     *****************/
    app.use( prettyErrorHandler.handleNotFound );
    app.use( prettyErrorHandler.handleException );

    app.config = config;
};

module.exports.config = config;

var strategy = require("./passport-strategy.js");

passport.use(strategy);

passport.serializeUser(strategy.serialize);

passport.deserializeUser(strategy.deserialize);