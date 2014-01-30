

(function model(exports, global) {
	var filesModel = {
		events: new EventEmitter(),
		readFiles: readFiles
	};

	function readFiles(folder) {
		var url = "files/" + encodeURIComponent(folder);
		
		$.get(url)

		.fail(onFailure)

		.done(function(files) {
			filesModel.files = files;
			filesModel.events.emit("filesChanged");
			
		});
	}
	
	function onFailure(xhr, textStatus, error) {
		console.log(textStatus + ": " + error);
	}

	exports.files = {
		model: filesModel
	};

	readFiles("parroit");

})(window, window);


(function view(exports, global) {
	var $ = global.jQuery;

	function addFile(file) {
		var body = $("#files tbody"),

			tr = $(
				"<tr>" +
				"	<td class='name'/>" +
				"	<td class='size'/>" +
				"	<td class='uploaded'/>" +
				"	<td class='actions'/>" +
				"</tr>"
			);

		var $name = tr.find(".name");
		$name.append(
			"<img src='/img/" + file.icon + "''>" +
			"&nbsp;<span>" + file.name + "</span>"
		);

		tr.find(".size").text(file.size);
		tr.find(".uploaded").text(file.uploaded);

		var pathEncoded = encodeURIComponent(file.path).replace(/\'/g, "&apos;");
		console.log(pathEncoded);

		tr.find(".actions").html(
			"<a " +
			"target='_blank' " +
			"href='/download/" + pathEncoded + "' " +
			"class='btn btn-primary download-file' " +
			"title='download file'>" +

			"<span class='glyphicon glyphicon-cloud-download'></span>" +
			"</a>"
		);

		body.append(tr);

	}

	

	

	global.files.model.events.on("filesChanged",function(){
		$("#files tbody").html("");
		global.files.model.files.forEach(addFile);
	});

	


})(window, window);