// CONNECT TO NODE SERVER
var socket = io.connect('http://192.168.1.12:7777');

// GENERATE UNIQUE KEY
var key = Date.now();

// ANOUNCE CLIENT TO SERVER
socket.emit('newUser', {id:key});

// ON RECIEVE
socket.on(key, function(data){

  if (data.key == key){
    if (data.timeCodePrecent < $('.progress-bar').attr('aria-valuenow')){
      $('.process').addClass('notransition');
    }
    $('.info').html(data.timeCodeRemaining + ' - ' + data.timeCodeTotal);
    $('.progress-bar').attr('aria-valuenow', data.timeCodePrecent);
    $('.progress-bar').css("width", data.timeCodePrecent + '%');

    // IMPORTANT!!!! CHECK CSS FILE FOR REMOVAL ANIMATION ON PROGRESS BAR
  }
})
