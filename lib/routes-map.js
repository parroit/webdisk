var routes = require("./routes"),
    passport = require("passport"),
    authRoutes = require("./auth-routes");


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}


module.exports = function(app) {
    /**
     * application
     */
    app.get("/", ensureAuthenticated, routes.template("index", ["files-toolbar", "folders-toolbar"]));


    app.get("/index", ensureAuthenticated, routes.template("index", ["files-toolbar", "folders-toolbar"]));

    app.get("/files/:path", routes.files);
    app.get("/download/:path", routes.download);
    app.get("/folders/:path", routes.folders);

    /**
     * auth
     */
    app.get('/login', routes.template("login"));
    app.post('/login', authRoutes.postLogin);
}
