var express = require("express"),
	wd = require("./webdisk"),
	less = require("less-middleware"),
	app = express();

app.use(express.logger());
app.use(less({ src: __dirname + "/../client" }));
app.use(express.static(__dirname + "/../client"));
app.use(express.static(__dirname + "/../bower_components"));

app.get("/files/:path", function(req, res) {
	var filesStream = wd.listFiles(req.params.path);
	res.setHeader("content-type", "text/plain");
	filesStream.pipe(res);
});

app.get("/folders/:path", function(req, res) {
	var foldersStream = wd.listFolders(req.params.path);
	res.setHeader("content-type", "text/plain");
	foldersStream.pipe(res);
});


app.listen(3000);
console.log("Listening on port 3000");