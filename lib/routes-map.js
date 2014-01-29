var routes = require("./routes");

module.exports = function(app) {

    app.get("/", routes.template("index", ["files-toolbar", "folders-toolbar"]));
    app.get("/index", routes.template("index", ["files-toolbar", "folders-toolbar"]));

    app.get("/files/:path", routes.files);
    app.get("/download/:path", routes.download);
    app.get("/folders/:path", routes.folders);

}