var lastPage;
var currentPage;
var messagesRef;


var baseURL = 'https://skate-life-backend.herokuapp.com/';


// login and show skateparks
$('.login-button').on('click', function(event){
	lastPage = $('div:not(.basic-buttons)').filter(':visible');	
	var path = baseURL + 'api/skateparks';


	$.ajax({
		url: path,
		method: 'get',
		dataType: 'json'
	})
	

	.done(function(response){
		$('.login-screen').hide();
		$('.basic-buttons').show();
		$('.skatepark-index').show();


		// appends all skateparks
		$.each(response, function(index, park) {
			$('.skateparks').append(
				$('<li>').append(
					$('<a>')
						.addClass('skatepark-link')
						.attr('href', baseURL + 'api/skateparks/' + park.id)
						.text(park.name)));
		});

	})

	.fail(function(response) {
		console.log(response);
	});
});



// Fix this so that it grabs the parent and hides that


// show an individual skatepark may need to abstract
$('.skatepark-index').on('click', '.skatepark-link', function(event){
	lastPage = $('div:not(.basic-buttons)').filter(':visible');

	event.preventDefault();
	var path = event.target.href
	var skateparkName = event.target.text


	$.ajax({
		url: path,
		method: 'get',
		dataType: 'json'
	})
	
	.done(function(response){
		// Firebase chat for individual skatepark
		// Had to use Global variable
		messagesRef = new Firebase('https://skate-life.firebaseio.com/' + skateparkName);
		
		// we dont want it if it doesn't have an address
		if(response.address === null){ response.address = 'no address' }
		$('.skatepark-name').text(skateparkName);
		$('.skatepark-index').hide();
		$('.skatepark-show').show();
		$('.messages').show();


		//add a callback that is triggered for each chat message
		messagesRef.on('child_added', function(snapshot){
			debugger
			var message = snapshot.val();
			
			$('.messages').append(
				$('<div>').addClass('message').append(
						$('<p>').text(message.name + ': ' + message.text)));

			$('.messages')[0].scrollTop = $('.messages')[0].scrollHeight;
		});

	})

	
	.fail(function(response){
		console.log(response);
	})
});





// when the user submits a message, post the message
$('.message-form').on('submit', function(event) {
	event.preventDefault();

	var name = $('#nameInput').val();
	var text = $('#messageInput').val();

	messagesRef.push({name: name, text: text});

	$('#messageInput').val('');
});






// Users Index page

$('.users-button').on('click', function(event) {
	lastPage = $('div:not(.basic-buttons)').filter(':visible');

	event.preventDefault();
	var path = baseURL + 'api/users'


	$.ajax({
		url: path,
		method: 'get',
		dataType: 'json'
	})

	.done(function(response){

		// Change this to event parent
		$('.skatepark-index').hide();
		$('.users-index').show();


		// append users to list
		$.each(response, function(index, user) {
			$('.users').append(
				$('<li>').append(
					$('<a>')
						.addClass('user-link')
						.attr('href', baseURL + 'api/users/' + user.id)
						.text(user.name)));
		});
	})

	.fail(function(response){
		console.log("showin you da haters")
	});

});





//show individual user and his favorites
$('.users').on('click', '.user-link', function(event) {
	lastPage = $('div:not(.basic-buttons)').filter(':visible');

	event.preventDefault();
	var path = event.target.href

	
	$.ajax({
		url: path,
		method: 'get',
		dataType: 'json'
	})

	.done(function(response){

		$('.users-show h1').text(response.user.name);
		$('.users-index').hide();
		$('.users-show').show();


		$.each(response.skateparks, function(index, skatepark) {
			$('.user-favs').append(
				$('<li>').append(
					$('<a>')
						.addClass('skatepark-link')
						.attr('href', baseURL + 'api/skateparks/' + skatepark.id)
						.text(skatepark.name)));
		});
	})
	
	.fail(function(response){
		console.log('failure @ life')
	});
});





// Basic buttons
$('.back').on('click', function(event) {
	event.preventDefault();
	currentPage = $('div:not(.basic-buttons)').filter(':visible');

	currentPage.hide();
	if (lastPage.hasClass('login-screen'))
		$('.basic-buttons').hide();

	lastPage.show();
});


$('.logout').on('click', function(event) {
	event.preventDefault();
	currentPage = $('div:not(.basic-buttons)').filter(':visible');

	currentPage.hide();
	$('.basic-buttons').hide();
	$('.login-screen').show();
});






