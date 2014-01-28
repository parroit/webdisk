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

		var $name = tr.find(".name");
		$name.append("<img src='/img/"+file.icon  + "''>");
		$name.append("&nbsp;<span>"+ file.name + "</span>");
		tr.find(".size").text(file.size);
		tr.find(".uploaded").text(file.uploaded);
		
		var pathEncoded = encodeURIComponent(file.path).replace(/\'/g,"&apos;");
		console.log(pathEncoded);

		tr.find(".actions").html(
			"<a "+
				"target='_blank' "+
				"href='/download/"+pathEncoded+"' "+
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