// get a reference to the root of the chat data.
var currentPark = $('.skatepark-name').text();
var messagesRef = new Firebase('https://skate-life.firebaseio.com/' + currentPark);




// when the user submits a message, post the message
$('body').on('submit', '.message-form', function(e){
	e.preventDefault();

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