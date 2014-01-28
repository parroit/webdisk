(function(exports, global) {
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

		tr.find(".name").text(file.name);
		tr.find(".size").text(file.size);
		tr.find(".uploaded").text(file.uploaded);
		
		tr.find(".actions").html(
			"<a "+
				"target='_blank' "+
				"href='/download/"+encodeURIComponent(file.path)+"' "+
				"class='btn btn-primary download-file' "+
				"title='download file'>"+
				
				"<span class='glyphicon glyphicon-cloud-download'></span>"+
			"</a>"
		);

		body.append(tr);

	}

	function onFailure(xhr, textStatus, error) {
		console.log(textStatus + ": " + error);
	}

	function readFiles(folder) {
		var url = "files/"+encodeURIComponent(folder);
		$("#files tbody").html("");
		$.get(url)

		.fail(onFailure)

		.done(function(files) {
			files.forEach(addFile);
		});
	}

	exports.files = {
		readFiles: readFiles
	};

	readFiles("parroit");


})(window, window);