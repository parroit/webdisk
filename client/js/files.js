(function model(exports, global) {

	var EventEmitter = global.EventEmitter,
		utils = global.utils,
		$ = global.jQuery,

		filesModel = {
			currentFolder: "",
			events: new EventEmitter(),
			files: [],
			toggleFileSelection: toggleFileSelection,
			selection: selection,
			readFiles: readFiles,
			deleteSelected: deleteSelected,
			uploadFilesChanged: uploadFilesChanged,
			uploadLocalFiles: uploadLocalFiles
		};


	function uploadFilesChanged(files) {
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			filesModel.files.push({
				name: file.name,
				path: filesModel.currentFolder + "/" + file.name,
				icon: file.type.replace(/\//g, "-") + ".png",
				uploaded: "not yet",
				size: file.size,
				domFile: file

			});
		}
		filesModel.events.emit("filesChanged");
	}

	function onUploadSucceded(file) {
		return function(data) {
			if (data.ok) {
				file.domFile = null;
				file.uploaded = new Date().getTime();
				return filesModel.events.emit("filesChanged");
			}
			utils.msgbox(
				"An error has occurred",
				file.name + " could not be uploaded, an error has occurred <br>" +
				data.reason
			);
		};
	}

	function uploadLocalFiles() {
		var i = 0,
			l = filesModel.files.length;


		for (; i < l; i++) {
			var file = filesModel.files[i];
			if (file.domFile) {
				$.ajax({
					type: "POST",
					url: "/upload/" + encodeURIComponent(file.path),
					data: file.domFile,
					processData: false,
					contentType: false,
					error: onFailure,
					success: onUploadSucceded(file)
				});
			}

		}
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


		utils.confirm(
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
							utils.msgbox(
								"An error has occurred",
								"Action could not be accomplished, " +
								"an error has occurred <br>" +
								data.reason,
								"failure"
							);
							return;
						}
						utils.msgbox("Successfully deleted files", data.files.join(", "), "success", function() {
							selectedFiles.forEach(function(file) {
								var idx = filesModel.files.map(function(f) {
									return f.path;
								}).indexOf(file);

								filesModel.files.splice(idx, 1);
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
			filesModel.currentFolder = folder;
			filesModel.files = files;
			filesModel.events.emit("filesChanged");

		});
	}

	


	function onFailure(xhr, textStatus, error) {
		utils.flashError(
			"Action could not be accomplished, an error has occurred <br>" +
			textStatus + " " +xhr.status +": " + error, "failure"
		);
	}

	exports.files = {
		model: filesModel

	};

	readFiles("parroit");

})(window, window);


(function view(exports, global) {
	var moment = global.moment,
		$ = global.jQuery,
		filesModel = global.files.model,
		selectionButtons = $("#download-btn, #remove-btn, #move-btn, #rename-btn");

	function humanFileSize(bytes, si) {
		var thresh = si ? 1000 : 1024;
		if (bytes < thresh) return bytes + " B";
		var units = si ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"] : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
		var u = -1;
		do {
			bytes /= thresh;
			++u;
		} while (bytes >= thresh);
		return bytes.toFixed(1) + "" + units[u];
	}

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

		tr.find(".size").text(humanFileSize(file.size));

		var uploaded = file.uploaded;
		if (typeof uploaded === "number") {
			uploaded = moment(uploaded).calendar();

		}
		tr.find(".uploaded").text(uploaded);


		tr.find(".actions").html(
			"<a " +
			"target='_blank' " +
			"href='/download/" + pathEncoded + "' " +
			"class='btn btn-primary download-file' " +
			"title='download file'>" +

			"<span class='glyphicon glyphicon-cloud-download'></span>" +
			"</a>"
		);

		if (file.domFile) {
			tr.addClass("warning");
			$("#upload-local-files-btn").removeAttr("disabled");
		}

		body.append(tr);

	}

	function toggleSelection() {
		var path = atob($(this).attr("id"));

		$(this).toggleClass("info");
		filesModel.toggleFileSelection(path);

	}

	function registerButtonHandlers() {
		$("#remove-btn").click(filesModel.deleteSelected);
		$("#upload-btn").click(function() {
			$("#file-chooser").trigger("click");
		});

		$("#file-chooser").change(function() {
			filesModel.uploadFilesChanged(this.files);
		});

		$("#upload-local-files-btn").click(function() {
			filesModel.uploadLocalFiles();

		});

	}

	function registerFilesHandlers() {
		$("tr").click(toggleSelection);


	}



	filesModel.events.on("filesChanged", function() {
		$("#files tbody").html("");
		$("#upload-local-files-btn").attr("disabled", "");
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