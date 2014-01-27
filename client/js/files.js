(function(exports, global) {
	var $ = global.jQuery;

	function addFile(file) {
		var body = $("#files tbody"),

			tr = $(
				"<tr>" +
				"	<td class='name'/>" +
				"	<td class='size'/>" +
				"	<td class='uploaded'/>" +
				"</tr>"
			);

		tr.find(".name").text(file.name);
		tr.find(".size").text(file.size);
		tr.find(".uploaded").text(file.uploaded);

		body.append(tr);

	}

	function onFailure(xhr, textStatus, error) {
		console.log(textStatus + ": " + error);
	}

	function readFiles() {
		var url = "/files/" + encodeURIComponent("test/files");

		$.get(url)

		.fail(onFailure)

		.done(function(data) {
			var files = JSON.parse(data);
			files.forEach(addFile);
		});
	}

	

	readFiles();
	

})(window, window);