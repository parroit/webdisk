var wd = require("./webdisk");

exports.files = function(req, res) {
	var path = decodeURIComponent(req.params.path),
		filesStream = wd.listFiles(path);

	res.setHeader("content-type", "text/plain");
	filesStream.pipe(res);
};

exports.folders = function(req, res) {
	var foldersStream = wd.listFolders(req.params.path);
	res.setHeader("content-type", "text/plain");
	foldersStream.pipe(res);
};

exports.template = function(name,partials) {
	var options = {
		partials: {
		}
	};

	partials.forEach(function(partial){
		options.partials[partial] = partial;
	});
	
	return function(req, res) {
		res.render(name, options);
	};

};