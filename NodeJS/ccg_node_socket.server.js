var express = require('express');
var bodyParser = require('body-parser');
var CasparCG = require("caspar-cg");
var app = express();
var osc = require('osc-min');
var udp = require("dgram");

// VARIABLES
var clients = [];
var wsPort = 7777;

var ccgServer = "localhost";
var ccgAMCPPort = 5250;
var ccgOSCPort = 6250;
var ccgChannel = 1;
var ccgLayer = 10;

var OSCupdated = 0;
var inport;
var sock;

// TC BASIC
var tcTotalGlobal = 0.000;
var tcRemainGlobal = 0.000;

// TC COMPARISON
var tcTotalGlobalNew = 0.000;
var tcRemainGlobalNew = 0.000;

// TC FROM OSC
var tcTotalGlobalOSC = 0.000;
var tcRemainGlobalOSC = 0.000;

// EXPRESS
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// SET NODE PORT
app.set('port', process.env.PORT || wsPort);
var server = app.listen(wsPort, function() {
    console.log(' -- NODE || ', "Node Webserver is started on port: " + server.address().port);
});

// SETUP SOCKET.IO
var io = require('socket.io')(server);
io.sockets.on('connection', function (socket) {
    console.log(' -- SOCKET.IO || ', "A new client has connected");
    socket.on('disconnect', function (data) {
        console.log(' -- SOCKET.IO || ', "A client has disconnected");
        if ( !socket.userId )
            return;
        delete clients[socket.userId];
    });

    // ADD NEW USER TO ARRAY
    socket.on('newUser', function(data) {
        socket.userId = data.id;
        clients[data.id] = socket;
        console.log(' -- SOCKET.IO || ', 'User: ' + data.id + ' is now connected');
    });

});

// INITIALIZE A TICK EVERY FRAME - 25fps
var timerTick = setInterval(sendTC, 40);

// CASPARCG - INITIALIZE UDP CONNECTION
ccg = new CasparCG(ccgServer, ccgAMCPPort);
ccg.connect(function () {
    ccg.info(function (err, serverInfo) {
        console.log(' -- CASPARCG || ', serverInfo);
    });

    // CASPARCG - START A CLIP ON CONNECTION
    ccg.ccg_command('PLAY 1-10 "AMB" LOOP');

    // ccg.ccg_command('LOADBG 1-10 EMPTY AUTO');
    // ccg.ccg_command('PLAY 1-10 "AMB"');

    // DISCONNECT FUNCTION - NOT NEEDED IN THIS EXAMPLE
    /*setTimeout(function () {
        ccg.clear("1");
        ccg.disconnect();
    }, 10 * 1000);*/


    // CASPARCG - SETUP OSC PORT
    if (process.argv[2] != null) {
      inport = parseInt(process.argv[2]);
    } else {
      inport = ccgOSCPort;
    }

    // CASPARCG - INITIALIZE OSC
    sock = udp.createSocket("udp4", function(msg, rinfo) {
      var error, error1;
      try {

        // CASPARCG - GET OSC
        osc_message = osc.fromBuffer(msg);

        // CASPARCG - SEARCH OSC TIME FROM DEFINED CHANNEL & LAYERS
        if (osc_message.elements[0].address == '/channel/' + ccgChannel + '/stage/layer/' + ccgLayer + '/file/time'){

          // CASPARCG - INITIALIZE
          tcTotalGlobalOSC = osc_message.elements[0].args[1].value;
          tcRemainGlobalOSC = osc_message.elements[0].args[0].value;
          tcTotalGlobalNew = osc_message.elements[0].args[1].value;
          tcRemainGlobalNew = osc_message.elements[0].args[0].value;

          // SOCKET.IO - SEND TC TO CLIENT FUNCTION
          sendTC();
        }

        // CASPARCG - CATCH ERROR
      } catch (error1) {
        error = error1;

      }
    });

    // SOCKET.IO - BIND CONNECTION
    sock.bind(inport);

});


// SEND TC TO CLIENT FUNCTION
function sendTC(){

  // CHECK IF TC HAD BEEN UPDATED BY OSC
  if(OSCupdated == 1){
    OSCupdated = 0;
  }
  // ELSE GET LAST TC MINUS 1 FRAME - FOR SMOOTH COUNTDOWN!!!!
  else{
    tcRemainGlobalNew = tcRemainGlobalNew + 0.04;
  }

  // CALCULATE REMAINING TIME
  var tcRemaining = tcTotalGlobalNew - tcRemainGlobalNew;
  tcRemaining = convertToTC(tcRemaining);

  // CALCULATE TOTAL TIME
  var tcTotal = tcTotalGlobalNew;
  tcTotal = convertToTC(tcTotal);

  // CALCULATE PRECENTAGE (FOR PROGRESS BAR)
  var tcPrecent = (tcRemainGlobalNew / tcTotalGlobalNew) * 100;

  // CAST VALUES TO CLIENTS
  for (var key in clients){
    clients[key].emit(key, { timeCodeRemaining: tcRemaining, timeCodeTotal: tcTotal, timeCodePrecent: tcPrecent, key: key});
  }
}

// TIMECODE CONVERTER (SECONDS/MS TO TC)
function convertToTC (timeCode){
  if (timeCode < 0){timeCode = 0;} // IF < 0 MAKE 0
  timeCode = timeCode.toString();
  var timeCodeArray = timeCode.split('.'); // SPLIT SECONDS/MILISECONDS

  // CALCULATE FRAMES
  if (!timeCodeArray[1]){timeCodeArray[1] = '0000';} // FIX!!! IF NO MILISECONDS
  var timeCodeMS = parseInt(timeCodeArray[1].substr(0, 3)); // ONLY USE FIRST 3 DECIMALS
  var timeCodeFPS = timeCodeMS/40;
  timeCodeFPS = Math.round(timeCodeFPS);
  timeCodeFPS = ("0" + timeCodeFPS).slice(-2); // LEADING 0

  // CALCULATE REMAINING HOURS/MINUTES/SECONDS
  var timeCodeH = Math.floor(timeCodeArray[0] / 3600);
  timeCodeH = ("0" + timeCodeH).slice(-2); // LEADING 0
  timeCodeArray[0] %= 3600;
  var timeCodeM = Math.floor(timeCodeArray[0] / 60);
  timeCodeM = ("0" + timeCodeM).slice(-2); // LEADING 0
  var timeCodeS = timeCodeArray[0] % 60;
  timeCodeS = ("0" + timeCodeS).slice(-2); // LEADING 0

  // RETURN TIMECODE
  return timeCodeH + ':' + timeCodeM + ':' + timeCodeS + ':' + timeCodeFPS;
}

// CASPARCG CONNECTION MESSAGE
ccg.on("connected", function () {
    console.log(' -- CASPARCG || ', 'Connected to CasparCG Server');
});
