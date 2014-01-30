(function model(exports, global) {
	var filesModel = {
		events: new EventEmitter(),
		files: [],
		toggleFileSelection: toggleFileSelection,
		selection: selection,
		readFiles: readFiles
	};

	function selection() {
		function isSelected(f) {
			return f.selected;
		}

		return filesModel.files.filter(isSelected);

	}


	function toggleFileSelection(filePath) {
		function matchPath(f) {
			return f.path === filePath;
		}

		var file = filesModel.files.filter(matchPath)[0];
		file.selected = !file.selected;

		var selectionLen = selection().length;

		if (selectionLen === 1) {

			filesModel.events.emit("selectionNotEmpty");

		} else if (selectionLen === 0) {

			filesModel.events.emit("selectionEmpty");

		}

	}

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
	var $ = global.jQuery,
		filesModel = global.files.model,
		selectionButtons = $("#download-btn, #remove-btn, #move-btn, #rename-btn");

	function addFile(file) {
		var body = $("#files tbody"),
			pathEncoded = encodeURIComponent(file.path).replace(/\'/g, "&apos;")

			tr = $(
				"<tr>" +
				"	<td class='name'/>" +
				"	<td class='size'/>" +
				"	<td class='uploaded'/>" +
				"	<td class='actions'/>" +
				"</tr>"
			),


			$name = tr.find(".name");

		tr.attr("id", file.path);

		$name.append(
			"<img src='/img/" + file.icon + "''>" +
			"&nbsp;<span>" + file.name + "</span>"
		);

		tr.find(".size").text(file.size);
		tr.find(".uploaded").text(file.uploaded);


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

	function registerFilesHandlers() {
		$("tr").click(function() {
			var path = $(this).attr("id");

			$(this).toggleClass("info");
			filesModel.toggleFileSelection(path);
		});
	}



	filesModel.events.on("filesChanged", function() {
		$("#files tbody").html("");
		global.files.model.files.forEach(addFile);
		registerFilesHandlers();
	});



	filesModel.events.on("selectionNotEmpty", function() {
		selectionButtons.removeAttr("disabled");
	});



	filesModel.events.on("selectionEmpty", function() {
		selectionButtons.attr("disabled","");
	});



	//exports.files.view = filesView;


})(window, window);