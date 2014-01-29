var express = require("express"),
    app = express(),
    appConfigure = require("./app-configure")
    routesMap = require("./routes-map");


appConfigure(app);
routesMap(app);


app.listen(3000);

console.log("Listening on port 3000");