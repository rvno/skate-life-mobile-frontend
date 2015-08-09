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

var setCurrentPark = function(skatepark){
	sessionStorage.setItem('skatepark', skatepark)
}

var clearChatScript = function(){
	$('.chat-script').remove();
}


// event listeners
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
			clearChatScript();

			var $skateparkList = $('<ul>')
				.addClass('skateparks');

			var $userButton = $('<button>')
				.text('Show Users')
				.addClass('users-button');

			$('body').append($skateparkList, $userButton);


			// appends all skateparks
			$.each(response, function(index, park) {
				$('.skateparks').append(
					$('<li>').append(
						$('<a>')
							.addClass('skatepark-link')
							.attr('href', baseURL + 'api/skateparks/' + park.id)
							// .attr('id', park.name)
							.text(park.name)));

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
		var skateparkName = event.target.text
		debugger

		$.ajax({
			url: path,
			method: 'get',
			dataType: 'json'
		})
		
		.done(function(response){
			clearPage();
			loadBasicButtons();
			clearChatScript();

			if(response.address === null){ response.address = 'no address' }
			
			// store cookie with current skatepark
			setCurrentPark(response.name);

			$('body').append(
				$('<div>').addClass('skatepark-page'));

			$('.skatepark-page').append(
				$('<h1>').addClass('skatepark-name').text(response.name),
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
							.addClass('message-submit')
							.attr('type', 'submit')
							.val('Post')));



			// Firebase chat for each skatepark
			var messagesRef = new Firebase('https://skate-life.firebaseio.com/' + skateparkName);



			// when the user submits a message, post the message
			$('.message-submit').on('submit', function(event) {
			// $('body').on('click', '.message-submit', function(event){
				console.log(event);
				event.preventDefault();

				var name = $('#nameInput').val();
				var text = $('#messageInput').val();

				// if (text !== "")
					messagesRef.push({name: name, text: text});

				$('#messageInput').val('');
			});


			//add a callback that is triggered for each chat message
			messagesRef.on('child_added', function(snapshot){
				var message = snapshot.val();
				debugger

				//make a new div to hold the message
				$('.messages').append(
					$('<div>').addClass('message').append(
							$('<p>').text(message.name + ': ' + message.text)));

				// $('.messages')[0].scrollTop = $('.messages')[0].scrollHeight;
			})

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
			clearChatScript();


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
			clearChatScript();
			

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
		clearChatScript();

		reloadPage();
	});

	// logout button
	$('body').on('click', '.logout-button', function(event){
		event.preventDefault();
		clearChatScript();

		logout();
	});


});