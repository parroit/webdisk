(function model(exports, global) {

	var EventEmitter = global.EventEmitter,
		$ = global.jQuery,
		filesModel = {
			events: new EventEmitter(),
			files: [],
			toggleFileSelection: toggleFileSelection,
			selection: selection,
			readFiles: readFiles,
			deleteSelected: deleteSelected
		};


	function msgbox(title, content, type, cb) {
		var dialog = $("#msgbox"),
			icon = dialog.find(".modal-body .glyphicon");


		if (!type || type === "success") {
			icon.addClass("glyphicon-ok-circle green");
		} else if (type === "failure") {
			icon.addClass("glyphicon-exclamation-sign red");
		}

		dialog.find(".ok-btn").click(function(e) {
			dialog.find(".ok-btn").off("click");
			if (cb) {
				cb();
			}
		});

		dialog.attr("aria-labelledby", title);
		dialog.find(".modal-title").html(title);
		dialog.find(".msgbox-content").html(content);

		dialog.modal("show");
	}

	function confirm(title, content, cb) {
		var dialog = $("#confirm");

		dialog.attr("aria-labelledby", title);
		dialog.find(".modal-title").html(title);
		dialog.find(".msgbox-content").html(content);


		dialog.find(".yes-btn").click(function(e) {
			dialog.find(".yes-btn").off("click");
			dialog.find(".no-btn").off("click");
			cb("yes");
		});

		dialog.find(".no-btn").click(function(e) {
			dialog.find(".yes-btn").off("click");
			dialog.find(".no-btn").off("click");
			cb("no");
		});

		dialog.modal("show");
	}



	function selection() {
		function isSelected(f) {
			return f.selected;
		}

		return filesModel.files.filter(isSelected);

	}



	function deleteSelected(cb) {
		var url = "/files",

			selectedFiles = selection().map(function(file) {
				return file.path;
			}),

			selectedFilesNames = selection().map(function(file) {
				return file.name;
			}).join(", ");


		confirm(
			"Confirm file deletion.",
			"Are you sure to delete files " + selectedFilesNames + " ?",
			function(answer) {
				if (answer === "no") {
					return;
				}

				$.ajax({
					type: "DELETE",
					url: url,
					headers: {
						"files": JSON.stringify(selectedFiles)
					},
					error: onFailure,
					success: function(data) {
						if (!data.ok) {
							msgbox(
								"An error has occurred",
								"Action could not be accomplished, " +
								"an error has occurred <br>" +
								data.reason,
								"failure"
							);
							return;
						}
						msgbox("Successfully deleted files", data.files.join(", "), "success" ,function() {
							selectedFiles.forEach(function(file) {
								var idx =  filesModel.files.map(function(f){
									return f.path;
								}).indexOf(file);

								filesModel.files.splice(idx,1);
								filesModel.events.emit("fileRemoved", file);
								filesModel.events.emit("selectionEmpty");
							});
						});

					}
				});
			}
		);



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
		msgbox("An error has occurred", "Action could not be accomplished, an error has occurred <br>" + textStatus + ": " + error, "failure");
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
			pathEncoded = encodeURIComponent(file.path).replace(/\'/g, "&apos;"),

			tr = $(
				"<tr>" +
				"	<td class='name'/>" +
				"	<td class='size'/>" +
				"	<td class='uploaded'/>" +
				"	<td class='actions'/>" +
				"</tr>"
			),


			$name = tr.find(".name");

		tr.attr("id", btoa(file.path));

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

	function toggleSelection() {
		var path = atob($(this).attr("id"));

		$(this).toggleClass("info");
		filesModel.toggleFileSelection(path);

	}

	function registerButtonHandlers() {
		$("#remove-btn").click(filesModel.deleteSelected);
	}

	function registerFilesHandlers() {
		$("tr").click(toggleSelection);


	}



	filesModel.events.on("filesChanged", function() {
		$("#files tbody").html("");
		global.files.model.files.forEach(addFile);
		registerFilesHandlers();
	});

	filesModel.events.on("fileRemoved", function(filePath) {
		var tr = $("#" + btoa(filePath).replace(/=/g, "\\="));
		tr.css("opacity", 0);
		setTimeout(function() {
			tr.remove();
		}, 300);
	});

	filesModel.events.on("selectionNotEmpty", function() {
		selectionButtons.removeAttr("disabled");
	});



	filesModel.events.on("selectionEmpty", function() {
		selectionButtons.attr("disabled", "");
	});



	registerButtonHandlers();


})(window, window);