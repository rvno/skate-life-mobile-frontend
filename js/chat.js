// get a reference to the root of the chat data.
var messagesRef = new Firebase('https://skate-life.firebaseio.com/hayward')

messagesRef.on('value', function(snapshot) {
	console.log(snapshot.val());
	$.each(snapshot.val(), function(index, message){
		console.log("this is the message " + message.name + " : " + message.text)
	})

}, function(errorObject) {
	console.log('The read failed: ' + errorObject.code);
	
});


// when the user submits a message, post the message
$('body').on('submit', '.message-form', function(e){
	e.preventDefault();
	console.log(e.target)
	var name = $('#nameInput').val();
	var text = $('#messageInput').val();
	messagesRef.push({name: name, text: text});
	$('#messageInput').val('');
});

//add a callback that is triggered for each chat message

messagesRef.on('child_added', function(snapshot){
	var message = snapshot.val();
	console.log(message.text)

	//make a new div to hold the message
	$('.messages').append('<div class="message"><p>'+message.name + ': ' + message.text + '</p></div>')


	// $('.messages')[0].scrollTop = $('.messages')[0].scrollHeight;
})