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

	function createFolderNode(folder) {
		return {

			title: folder.name,
			key: folder.path,
			children: [],
			folder: true,
			lazy: true
		};


	}

	function loadSubFolders(event, data) {
		var url = "/folders/" + encodeURIComponent(data.node.key);

		data.result = {
			url: url,
			data: {
				key: data.node.key
			}
		};
		/*
		var node = data.node;



		$.get(url)

		.fail(onFailure)

		.done(function(folders) {
			data.result = [];
			folders = JSON.parse(folders);
			folders.forEach(function(folder) {

				data.result.push(createFolderNode(folder));

			});
		});
*/
	}

	function readFolders() {

		var data = createFolderNode({
			name: "test",
			path: "test"
		});

		$(".folders-tree").fancytree({
			clickFolderMode: 2,
			lazyload: loadSubFolders,

			source: [data]


		});
	}


	readFiles();
	readFolders();

})(window, window);