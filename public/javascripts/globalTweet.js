$(document).ready(function() {
	$('#btnSubmit').on('click', searchTweets);
	$('.results').on('click', editKeyboard);
	$(document).on('click', '#send', sendCall);
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
		dataType: 'JSON',
		error: ajaxError
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
		content += '<textarea class="form-control results" rows="3">' + json[key] + '</textarea>'
		content += '</div><span>'
		content += 140 - json[key].length + ' characters left<br /><input type="checkbox"> <b>Add this URL</b></span>'
		content += '</div>';
		content += '<p>';
	}
	content += '<button id="send" type="submit">Submit</button>';
	$('#results').html(content);
}

//@TODO doesn't work
function editKeyboard(event) {
	event.preventDefault();
	console.log($(this).next().text());
	var words = $(this).parent().parent().find('span').text();
	$(this).next().html('sdf');
}

function sendCall() {
	var tweets = [];
	$('#results').children().each(function(key) {
		//if it does exist, length will be greater than 0
		if($(this).has('input').length > 0) {
			if($(this).find('input').is(':checked') > 0) {
				var text = $(this).find('textarea').text();
				tweets.push({"text": text});
			}
		}
	});
	//console.log(tweets);
	if(tweets.length > 0) {
		var json = (JSON.stringify(tweets));
		//console.log(json);
		json1 = {'text': 5};
		var search = {
						'url': 'http://benefitsofmuscle.com/benefits-of-squat/'
					};
		$.ajax({
				type:'POST',
				data: search,
				url: '/tweet/call',
				dataType: 'text',
				error: ajaxError
			}).done(function(response) {
				console.log(response + " asdasd");
			});
	}
} 

function ajaxError(jqXHR, textStatus, errorThrown){
	console.log(textStatus);
}

