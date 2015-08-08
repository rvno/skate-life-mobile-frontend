$(document).ready(function(){
	baseURL = 'https://skate-life-backend.herokuapp.com/'

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
		$('body').html('')
		$('body').append('<ul class="skateparks"></ul>')
		$.each(response, function(index, park){
			index = index + 1
		$('.skateparks').append('<li><a class="skatepark-link" href=' + baseURL + 'api/skateparks/' + index +'>' +index + ":" + park.name+'</a></li>');
		})
	})
	request.fail("nope")
	});

	// show skatepark
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
			$('body').html('')
			$('body').append('<div class="skatepark-page"></div>')
			if(response.address === null){
				response.address = 'no address'
			}
			$('.skatepark-page').append('<p>'+response.name+'</p><p>'+response.address+'</p>')
			// fav_count
		})
		request.fail(function(response){
			console.log("nope")
		})
	})

})