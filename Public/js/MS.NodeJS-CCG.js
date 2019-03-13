// SOCKETIO CONNECT
var socket = io.connect('http://192.168.1.12:7777', {
    query: {
        room: 'web'
    }
});

// SIO || CONNECT
socket.on('connect',function() {
  console.log('Connected to NodeJS Server');
       
});

// SIO || DISCONNECT
socket.on('disconnect',function() {
  console.log('Disconnected to NodeJS Server');
  clearData();
});

// SIO || TIMING RECIEVED
socket.on('timing',function(timingReceived) {

  // CLEAR WHEN NO VIDEO IS PRESENT ON CHANNEL
  if(timingReceived.videoPresent == false){
    clearData();
  }
  else{
    // UPDATE TEXT
    $('#infobox #current h1').html(timingReceived.currentTimeConverted);
    $('#infobox #duration h1').html(timingReceived.currentDurationConverted);
    $('#infobox #remaining h1').html(timingReceived.currentCountDownConverted);

    // UPDATE PROGRESSBAR
    $('#infobox #progress').attr('aria-valuenow', timingReceived.currentProgressPrecent);
    $('#infobox #progress').css("width", timingReceived.currentProgressPrecent + '%');
  }  
});

// Clear Data
function clearData(){
  $('#infobox #current h1').html('00:00:00:00');
  $('#infobox #duration h1').html('00:00:00:00');
  $('#infobox #remaining h1').html('00:00:00:00');
  $('#infobox #progress').attr('aria-valuenow', '0');
  $('#infobox #progress').css("width", '0%');
}

// UI Action Click
$(document).on('click', '#infobox #uiAction', function(e){
  var action = $(this).attr('action');
  socket.emit('UI|action', {action: action});       
});