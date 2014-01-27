var express = require("express"),
	hogan = require("hogan-express"),
	less = require("less-middleware"),
	routes = require("./routes"),
	app = express();

app.set ("view engine", "html");
app.set ("layout", "layout");
//app.enable "view cache"
app.engine ("html", hogan);

app.use(express.logger());
app.use(less({ src: __dirname + "/../client" }));
app.use(express.static(__dirname + "/../client"));
app.use(express.static(__dirname + "/../bower_components"));


app.get("/", routes.template("index",["files-toolbar","folders-toolbar"]));
app.get("/index", routes.template("index",["files-toolbar","folders-toolbar"]));

app.get("/files/:path", routes.files);
app.get("/folders/:path", routes.folders);


app.listen(3000);
console.log("Listening on port 3000");