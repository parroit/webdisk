(function(exports, global){

	function addFile(file){
		var body = $("#files tbody"),

			tr = $(
				"<tr>"+
				"	<td class='name'/>"+
				"	<td class='size'/>"+
				"	<td class='uploaded'/>"+
				"</tr>"
			);

		tr.find(".name").text(file.name);
		tr.find(".size").text(file.size);
		tr.find(".uploaded").text(file.uploaded);

		body.append(tr);

	}


	var $ = global.jQuery;

	$.get( "/files/"+
		encodeURIComponent("test/files"))

		.fail(function(xhr,textStatus, error) {
			console.log(textStatus+ ": " + error );
		})

		.done(function(data) {
			var files = JSON.parse(data);

			files.forEach(addFile);
		});

})(window,window);