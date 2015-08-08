$(document).ready(function(){
	baseURL = 'https://skate-life-backend.herokuapp.com/'

	// login function
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
		$.each(response, function(index, park){
		$('body').append('<p>'+index + ":" + park.name+'</p>');
})
	})
	request.fail("nope")
	})

})