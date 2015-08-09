var clearPage = function(){
	$('body').html('');
}

var reloadPage =  function(){
	clearPage();
	$('body').append(sessionStorage.getItem('page-content'));
}

var savePage = function(){
	currentContent = $('body').html();
	sessionStorage.setItem('page-content', currentContent);
}

var loadBasicButtons = function(){
	$('body').prepend('<button class="back-button">back</button>');
	$('body').append('<button class="logout-button">logout</button>');
}

var logout = function(){
	location.replace(sessionStorage.getItem('login-screen'));
}

$(document).ready(function(){
	baseURL = 'https://skate-life-backend.herokuapp.com/';
	var loginScreen = $('body').html();

	sessionStorage.setItem('login-screen', location.pathname);
	




	// login and show skateparks
	$('.login-button').on('click', function(){
		var path = baseURL + 'api/skateparks';

		$.ajax({
			url: path,
			method: 'get',
			dataType: 'json'
		})
		

		.done(function(response){
			clearPage();
			loadBasicButtons();

			var $skateparkList = $('<ul>')
				.addClass('skateparks');

			var $userButton = $('<button>')
				.text('Show Users')
				.addClass('users-button');

			$('body').append($skateparkList, $userButton);


			// appends all skateparks
			$.each(response, function(index, park) {
				index = index + 1

				var $skateparkLink = $('<li>').append(
					$('<a>').addClass('skatepark-link')
						.attr('href', baseURL + 'api/skateparks/' + park.id)
						.text(park.name));

				$('.skateparks').append($skateparkLink);

				savePage();
			});

		})

		.fail(function(response) {
			console.log(response);
		});
	});




	// show an individual skatepark may need to abstract
	$('body').on('click', '.skatepark-link', function(event){
		event.preventDefault();
		var path = event.target.href

		$.ajax({
			url: path,
			method: 'get',
			dataType: 'json'
		})
		
		.done(function(response){
			clearPage();
			loadBasicButtons();

			if(response.address === null){ response.address = 'no address' }
			
			$('body').append(
				$('<div>').addClass('skatepark-page'));

			$('.skatepark-page').append(
				$('<p>').text(response.name),
				$('<p>').text(response.address),
				$('<div>').addClass('messages'),
				$('<form>').addClass('message-form')
					.append(
						$('<input>')
							.attr('type', 'text')
							.attr('id', 'nameInput')
							.attr('placeholder', 'Name'),
						$('<input>')
							.attr('type', 'text')
							.attr('id', 'messageInput')
							.attr('placeholder', 'Message'),
						$('<input>')
							.attr('type', 'submit')
							.val('Post')));

		})
		
		.fail(function(response){
			console.log(response);
		})
	})




	// Users Index page
	$('body').on('click', '.users-button', function(event){
		event.preventDefault();
		var path = baseURL + 'api/users'

		$.ajax({
			url: path,
			method: 'get',
			dataType: 'json'
		})

		.done(function(response){
			clearPage();
			loadBasicButtons();

			$('body').append(
				$('<ul>').addClass('skaters'));

			// append users to list
			$.each(response, function(index, user) {
				$('.skaters').append(
					$('<li>').append(
						$('<a>')
							.addClass('skater-link')
							.attr('href', baseURL + 'api/users/' + user.id)
							.text(user.name)));

			});
		})

		.fail(function(response){
			console.log("showin you da haters")
		});

	});




	//show individual user and his favorites
	$('body').on('click', '.skater-link', function(event){
		event.preventDefault();
		var path = event.target.href
		
		$.ajax({
			url: path,
			method: 'get', 
			dataType: 'json'
		})

		.done(function(response){
			clearPage();
			loadBasicButtons();

			$('body').append(
				$('<h3>').text(response.user.name),
				$('<ul>').addClass('user-favorites'));


			$.each(response.skateparks, function(index, skatepark) {
				$('.user-favorites').append(
					$('<li>').append(
						$('<a>')
							.addClass('skatepark-link')
							.attr('href', baseURL + 'api/skateparks/' + skatepark.id)
							.text(skatepark.name)));
			});
		})
		
		.fail(function(response){
			console.log('failure @ life')
		})
	})

	// back button functionality -- consider refactoring or abstracting functionality 
	$('body').on('click', '.back-button', function(event){
		event.preventDefault();
		// $('body').html('')
		// $('body').append(sessionStorage.getItem('page-content'))
		reloadPage();
	})

	// logout button
	$('body').on('click', '.logout-button', function(event){
		event.preventDefault();
		logout();
	})


})