var wd = require("./webdisk");

wd.configure("/home");

exports.files = function(req, res) {
	var path = decodeURIComponent(req.params.path),
		filesStream = wd.listFiles(path);

	res.setHeader("content-type", "application/json");
	filesStream.pipe(res);
};

exports.folders = function(req, res) {
	var path = decodeURIComponent(req.params.path),
		foldersStream = wd.listFolders(path);

	res.setHeader("content-type", "application/json");
	foldersStream.pipe(res);
};

exports.download = function(req, res) {
	var path = decodeURIComponent(req.params.path),
		fileStream = wd.readFile(path);

	res.setHeader("content-type", fileStream.mime);
	fileStream.pipe(res);
};

exports.template = function(name, partials) {
	var options = {
		partials: {}
	};

	partials.forEach(function(partial) {
		options.partials[partial] = partial;
	});

	return function(req, res) {
		res.render(name, options);
	};

};