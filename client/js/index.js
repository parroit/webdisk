(function(exports, global){

	var $ = global.jQuery;

	$.get( "/files/"+
		encodeURIComponent("test/files"))

		.fail(function(xhr,textStatus, error) {
			console.log(textStatus+
				": "+ error );
		})

		.done(function(data) {
			var files = data.split("\n"),
				body = $("#files tbody");

			files.forEach(function(file){
				var tr = $(
					"<tr>"+
					"	<td class='name'/>"+
					"	<td class='size'/>"+
					"	<td class='last-edit'/>"+
					"	<td class='created'/>"+
					"</tr>");

				tr.find(".name").text(file);

				body.append(tr);

			});
		});

})(window,window);