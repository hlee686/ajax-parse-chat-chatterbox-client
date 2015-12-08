// YOUR CODE HERE:

// ajax call out
// parse return

var myDataStore = {};

function getMessages() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    // 'where={"playerName":"Sean Plott","cheatMode":false}'
    url: 'https://api.parse.com/1/classes/chatterbox',
    method: 'GET',
    data: {'order':'-createdAt', 'limit':'1000'},
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

// this puts together a message in HTML to display on page
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
  var remaining = myDataStore.messages.length - index;

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

// sends a json object to Parse server
function postMessage(newMessage) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    method: 'POST',
    data: newMessage,
    contentType: 'application/json',
    success: function(){
      console.log('Message was sent! Message = ' + newMessage);
      $('.messageText').val('');
      $('.holdsMessages').html('');
      getMessages();
    },
    error: function(error){
      console.log('Failed to send message! Error: ' + error);
    }
  });
}

// createdAt: "2015-09-01T01:00:42.028Z"
// objectId: "hwhupXO0iX"
// roomname: "4chan"
// text: "trololo"
// updatedAt: "2015-09-01T01:00:42.028Z"
// username: "shawndrost"

// builds a json object from form submissions
function buildMessageObject(user, time, text) {
  // take data about message: text, user, date, room
  // build object to be passed to server
  var messageObject = {
    roomname: '',
    text: text,
    username: user
  };
  console.log(messageObject);
  // return object to be sent
  return messageObject;
}

$(document).ready(function() {
  // this gets URL of page
  var URL = window.location.search;
  //calling reg expression, it returns an array, the second is what we want
  myDataStore.username = /username=(.*)/.exec(URL)[1];
  // initial getMessages and apply them to the page
  getMessages();

  $('.getOld').on('click', function(){
    appendMessages(myDataStore.index);
  });

  $('.refresh').on('click', function(){
    // these are two ways to do the same "clear when new things appear" behavior
    // $('.message').remove();
    $('.holdsMessages').html('');
    getMessages();
  });

  $('.messageSubmit').on('click', function(){
    var message, createdAt, room, messageObject;
    message = $('.messageText').val();
    createdAt = new Date().toISOString();
    messageObject = buildMessageObject(myDataStore.username, createdAt, message);
    messageObject = JSON.stringify(messageObject);
    postMessage(messageObject);
  });
});






