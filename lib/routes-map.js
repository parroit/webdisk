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
     * web pages
     */
    app.get("/",  routes.template("index"));
    app.get("/index",  routes.template("index"));


    /**
     * application
     */
    app.get("/files", ensureAuthenticated, routes.template("files", ["files-toolbar", "folders-toolbar"]));
    app.get("/upload", ensureAuthenticated, routes.template("upload"));

    app.get("/files/:path", routes.files);
    app.get("/download/:path", routes.download);
    app.get("/folders/:path", routes.folders);

    /**
     * auth
     */
    app.get('/login', routes.template("login"));
    app.post('/login', authRoutes.postLogin);
    app.get('/logout', ensureAuthenticated, authRoutes.logout);
}
