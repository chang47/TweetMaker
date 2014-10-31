$(function() {
	$('#search').on('keyup', function(e) {
		if(e.keyCode === 13) {
			var parameters = { search: $(this).val()};
			console.log("message");
			$.post('/searching', parameters, function(data) {
				console.log("message");
				$('#results').html(data);
			});
		};
	});
});