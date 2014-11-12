$(document).ready(function() {
	$('#btnSubmit').on('click', searchTweets);
});

function populateTable() {
	var tableContent = "";
	$.getJSON('/users/userlist', function(data) {
		userListData = data;
		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
			tableContent += '</tr>';
		});
		$('#userList table tbody').html(tableContent);
	});
};

function showUserInfo(event) {
	event.preventDefault();
	var thisUserName = $(this).attr('rel');
	var arrayPosition = userListData.map(function(arrayItem) {
		return arrayItem.username;
	}).indexOf(thisUserName);
	
	var thisUserObject = userListData[arrayPosition];
	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);

};

function addUser(event) {
	event.preventDefault();
	var errorCount = 0;
	$('#addUser input').each(function(index, val) {
		if($(this).val() === '') {
			errorCount++;
		}
	});
	if(errorCount === 0) {
		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
			'email': $('#addUser fieldset input#inputUserEmail').val(),
			'fullname': $('#addUser fieldset input#inputUserFullName').val(),
			'age': $('#addUser fieldset input#inputUserAge').val(),
			'location': $('#addUser fieldset input#inputUserLocation').val(),
			'gender': $('#addUser fieldset input#inputUserGender').val()
		}

		$.ajax({
			type: 'Post',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function(response) {
			if(response.msg === '') {
				$('#addUser fieldset input').val('');
				populateTable();
			} else {
				alert('Error: ' + response.msg);
			}
		});
	} else {
		alert('Please fill in all fields');
		return false;
	}

};

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
		content += "<p>" + json[key] + "</p>";
	}
	$('#results').html(content);
}

