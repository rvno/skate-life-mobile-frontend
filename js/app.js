var clearPage = function(){
	$('body').html('')
}

var reloadPage =  function(){
	clearPage();
	$('body').append(sessionStorage.getItem('page-content'))
}

var savePage = function(){
	currentContent = $('body').html();
	sessionStorage.setItem('page-content', currentContent)
}

var loadBasicButtons = function(){
	$('body').prepend('<button class="back-button">back</button>')
	$('body').append('<button class="logout-button">logout</button>')
}

var logout = function(){
	location.replace(sessionStorage.getItem('login-screen'))
}

$(document).ready(function(){
	baseURL = 'https://skate-life-backend.herokuapp.com/'
	var loginScreen = $('body').html();
	sessionStorage.setItem('login-screen', location.pathname)
	// login function => show skateparks
	$('.login-button').on('click', function(){
	console.log("hello");
	console.log(baseURL)
	var path = baseURL + 'api/skateparks'
	var request = $.ajax({
		url: path,
		method: 'get', 
		dataType: 'json'
	})
	request.done(function(response){
		console.log("aye")
		clearPage();
		loadBasicButtons();
		$('body').append('<ul class="skateparks"></ul>')
		$('body').append('<button class="users-button">Show Users</button')
		$.each(response, function(index, park){
			index = index + 1
		$('.skateparks').append('<li><a class="skatepark-link" href=' + baseURL + 'api/skateparks/' + index +'>' +index + ":" + park.name+'</a></li>');
		savePage();
		//skatepark id sub index
		})
	})
	request.fail("nope")
	});

	// show an individual skatepark may need to abstract
	$('body').on('click', '.skatepark-link', function(e){
		e.preventDefault();
		console.log(e.target.href)
		var path = e.target.href
		var request =  $.ajax({
			url: path,
			method: 'get',
			dataType: 'json'
		})
		request.done(function(response){
			console.log("yup")
			clearPage();
			loadBasicButtons();
			$('body').append('<div class="skatepark-page"></div>')
			if(response.address === null){
				response.address = 'no address'
			}
			$('.skatepark-page').append('<p>'+response.name+'</p><p>'+response.address+'</p>')
			// fav_count
			$('.skatepark-page').append('<div class="messages"></div>')
			$('.skatepark-page').append('<form class="message-form"><input type="text" id="nameInput" placeholder="Name" /><input type="text" id="messageInput" placeholder="Message..."/><input type="submit" value="Post"/></form>')
		})
		request.fail(function(response){
			console.log("nope")
		})
	})

	//show users
	$('body').on('click', '.users-button', function(e){
		e.preventDefault();
		var path = baseURL + 'api/users'
		var request = $.ajax({
			url: path,
			method: 'get',
			dataType: 'json'
		})
		request.done(function(response){
			console.log("show me da skaters")
			clearPage();
			loadBasicButtons();
			$('body').append('<ul class="skaters"></ul>')
			$.each(response, function(index, skater){
				index = index + 1
			$('.skaters').append('<li><a class="skater-link" href=' + baseURL + 'api/users/' + index +'>' +index + ":" + skater.name+'</a></li>');

			})
		})
		request.fail(function(response){
			console.log("showin you da haters")
		})
	})

	//show individual user and his favorites
	$('body').on('click', '.skater-link', function(e){
		e.preventDefault();
		var path = e.target.href
		var request = $.ajax({
			url: path,
			method: 'get', 
			dataType: 'json'
		})
		request.done(function(response){
			console.log("sup " + response.user.name)
			clearPage();
			loadBasicButtons();
			$('body').append('<h3>'+response.user.name+'</h3>')
			$('body').append('<ul class="user-favorites"></ul>')
			$.each(response.skateparks, function(index, skatepark){
				index = index + 1
				$('.user-favorites').append('<li><a class="skatepark-link" href=' + baseURL + 'api/skateparks/' + index +'>' +skatepark.name+'</a></li>')
				
			})
		})
		request.fail(function(response){
			console.log('failure @ life')
		})
	})

	// back button functionality -- consider refactoring or abstracting functionality 
	$('body').on('click', '.back-button', function(e){
		e.preventDefault();
		// $('body').html('')
		// $('body').append(sessionStorage.getItem('page-content'))
		reloadPage();
	})

	// logout button
	$('body').on('click', '.logout-button', function(e){
		e.preventDefault();
		logout();
	})


})