var wd = require("./webdisk"),
	fs = require("fs");

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
	var path = decodeURIComponent(req.params.path);

	wd.readFile(path, function(err, fileStream) {
		if (err) {
			throw err;
		}
		res.setHeader("content-disposition", "attachment; filename=\"" + fileStream.name + "\"");
		res.setHeader("content-type", fileStream.mime);
		res.setHeader("content-length", fileStream.size);
		fileStream.pipe(res);
	});


};

exports.upload = function(req, res) {
	var path = decodeURIComponent(req.params.path);
	console.log(path)
	wd.writeFile(path, req)
		.then(res.json.bind(res))
		.then(null, function(err) {
			
			res.json({
				ok: false,
				reason: err.stack
			});
		});


};



exports.deleteFiles = function(req, res) {
	res.setHeader("content-type", "application/json");
	var files = JSON.parse(req.headers.files);

	wd.deleteFiles(files)
		.then(res.json.bind(res))
		.then(null, function(err) {
			
			res.json({
				ok: false,
				reason: err.stack
			});
		});

};


exports.template = function(name, partials) {
	var options = {
		partials: {
			navbar: "navbar",
			dialogs: "dialogs"
		}

	};

	if (partials && partials.length) {
		partials.forEach(function(partial) {
			options.partials[partial] = partial;
		});
	}

	return function(req, res) {
		options.errors = req.flash("error");
		options.messages = req.flash("info");
		options.user = req.user;
		//console.dir(req.user)
		res.render(name, options);
	};

};