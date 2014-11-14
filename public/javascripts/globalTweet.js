$(document).ready(function() {
	$('#btnSubmit').on('click', searchTweets);
});

//@TODO parse string to be 118 char and include URL
function searchTweets(event) {
	event.preventDefault();
	var search = {
		'url': $('#makeTweet fieldset input#inputURL').val()
	};
	console.log(search);
	$.ajax({
		type: 'POST',
		data: search,
		url: '/tweet/maketweets',
		dataType: 'JSON'
	}).done(function(response) {
		//requires some form of error checking
		populateTweets(response)
	});
}

function populateTweets(json) {
	var content = "";
	event.preventDefault();
	for(var key in json) {
		content += '<div class="row">';
		content += '<div class="col-md-6 col-md-offset-0">'
		content += '<textarea class="form-control" rows="4">' + json[key] + '</textarea>'
		content += '</div></div>';
		content += '<p>';
	}
	$('#results').html(content);
}
