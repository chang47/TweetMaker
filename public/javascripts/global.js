var userListData = [];
$(document).ready(function() {
	populateTable();
	$('#userList table tbody').on('click', 'td a.linkshowuser', showerUserInfo);
})

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