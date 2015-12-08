// YOUR CODE HERE:

// ajax call out
// parse return

// createdAt: "2015-09-01T01:00:42.028Z"
// objectId: "hwhupXO0iX"
// roomname: "4chan"
// text: "trololo"
// updatedAt: "2015-09-01T01:00:42.028Z"
// username: "shawndrost"

var myDataStore = {};

function getMessages() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    // 'where={"playerName":"Sean Plott","cheatMode":false}'
    url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt&limit=1000',
    method: 'GET',
    data: 'text',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message received. Data: ', data);
      // store fetched messages on myDataStore object
      myDataStore.messages = data.results;
      // index is the newest message, ie, last in returned array
      myDataStore.index = 0;
      appendMessages(myDataStore.index);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive messages. Error: ', data);
    }
  });
}

function buildMessage(index) {
  var picture, username, time, text, message;
  picture = '<div class="userpic"></div>';
  username = '<div class="username">' + myDataStore.messages[index].username + '</div>';
  time = '<div class="createdAt">' + myDataStore.messages[index].createdAt + '</div>';
  text = '<div class="text">' + myDataStore.messages[index].text + '</div>';
  message ='<div class="message">' + picture + username + time + text + '</div>';
  return message;
}

// function that fetches chunks of 25ish messages based on index of current newest message
function appendMessages(index) {
  var counter;
  var message;
  var remaining = index - myDataStore.messages.length;

  if (remaining < 25) {
    counter = remaining;
  }
  else {
    counter = 25;
  }

  while(counter) {
    message = buildMessage(index);
    $('.holdsMessages').append(message);
    counter--;
    index++;
  }
  myDataStore.index = index;
}

$(document).ready(function() {
  getMessages();

  $('.getOld').on('click', function(){
    appendMessages(myDataStore.index);
  });

  $('.refresh').on('click', function(){
    //these are two ways to do the same "clear when new things appear" behavior
    // $('.message').remove();
    $('.holdsMessages').html('');
    getMessages();
  });
});