// GLOBAL SETTINGS
var globalSettings = require("./CCG.SocketIO.Config");

// Terminal Colors
var term = require('terminal-kit').terminal ;

// CasparCG Connection
const {CasparCG} = require("casparcg-connection");

// TimerThingy
var timexe = require('timexe');

// SOCKET.IO
var socket_app = require('express')();
var socket_server = require('http').createServer(socket_app);
var socket_io = require('socket.io')(socket_server);

// OSC
var oscClient = require('osc-min');
var udpConnection = require("dgram");

// SAVED CONNECTIONS
var CasparCG_Connection = null;
var socketIO_Connection = socket_io;

// VARIABLES
var timecodeVars = {
    videoPresent: null,
    currentTime: 0,
    currentTimeConverted: '00:00:00:00',
    currentDuration: 0,
    currentDurationConverted: '00:00:00:00',
    currentCountDown: 0,
    currentCountDownConverted: 0,
    currentProgressPrecent: 0
}

var msPerFrame = 40; // PAL 25 FPS

// Start CCG Connector
ccgConnector(function(err){
    if(!err){
        term("\n"+dateTimeNow()+"\t^#^g^W CASPARCG ^ \tConnected to CasparCG Server");
        ccgConnectOSC();
    }
    else{
        if(err == 'disconnected'){
            term("\n"+dateTimeNow()+"\t^#^r^W CASPARCG ^ \tDisconnected from CasparCG Server");
        }
    }
});

// Start SocketIO Connector
socketIOConnector(function(err, response){
    if(!err){
        term(response);
    }
    else{
        if(err == 'disconnect'){
            term(response);
        }
    }
});

// SOCKETIO CONNECTOR
function socketIOConnector(callback){
    // SOCKET IO LISTEN
    socket_server.listen(globalSettings.socketIO.port);
  
    // SOCKET IO OPEN
    socketIO_Connection.on('connection', function(socket){

        // ADD CLIENT TO ROOM  (OPTIONAL)
        var roomName = socket.handshake.query.room;
        socket.join(roomName);
        if(roomName == 'web'){
            callback(undefined, "\n"+dateTimeNow()+"\t^#^g^W SOCKET.IO ^ \tClient Connect:\t\t[Web]\t\tID: "+socket.id)
        }
        
        // SOCKET.IO CLIENT DISCONNECT
        socket.on('disconnect', function(){               
            if(roomName == 'web'){
                callback('disconnect', "\n"+dateTimeNow()+"\t^#^r^W SOCKET.IO ^ \tClient Disconnected:\t[Web]\t\tID: "+socket.id)
            }
        });

        // GET ACTION FROM UI
        socket.on('UI|action', function(uiActionReceived){
          uiActions(uiActionReceived);
        }); 
    });
}

// UI Actions
function uiActions(uiActionReceived){
    if(uiActionReceived.action == 'play'){
        ccg_PlayMedia(globalSettings.CasparCG.ccgChannel, globalSettings.CasparCG.ccgLayer_video_01, 'AMB', function(err, response){
            if(!err){
                term(response);
            }
        });
    }

    if(uiActionReceived.action == 'pause'){
        ccg_PauseMedia(globalSettings.CasparCG.ccgChannel, globalSettings.CasparCG.ccgLayer_video_01, function(err, response){
            if(!err){
                term(response);
            }
        });
    }

    if(uiActionReceived.action == 'stop'){
        ccg_StopMedia(globalSettings.CasparCG.ccgChannel, globalSettings.CasparCG.ccgLayer_video_01, function(err, response){
            if(!err){
                term(response);
            }
        });
    }
}

// SOCKETIO SEND DATA
function IOSendData(targets, type, vars){
    if (socketIO_Connection != null){
        
        // SEND TIMING
        if(type == 'timing'){
            targets.forEach(function(target){
            socketIO_Connection.to(target).emit('timing', vars);
            });
        }
    }
}

// CCG Play Media
function ccg_PlayMedia(ccgChannel, ccgLayer, file, callback){
    if(CasparCG_Connection != undefined){
        CasparCG_Connection.play(ccgChannel, ccgLayer, file);
        callback(undefined, "\n"+dateTimeNow()+"\t^#^M^W CASPARCG ^ \tMedia Started:\t\t[Video]\t\tFile: "+ccgChannel+'-'+ccgLayer+' '+file)
    }
}

// CCG Pause Media
function ccg_PauseMedia(ccgChannel, ccgLayer, callback){
    if(CasparCG_Connection != undefined){
        CasparCG_Connection.pause(ccgChannel, ccgLayer);
        callback(undefined, "\n"+dateTimeNow()+"\t^#^M^W CASPARCG ^ \tMedia Paused:\t\t[Video]\t\tFile: "+ccgChannel+'-'+ccgLayer)
    }
}

// CCG Stop Media
function ccg_StopMedia(ccgChannel, ccgLayer, callback){
    if(CasparCG_Connection != undefined){
        CasparCG_Connection.stop(ccgChannel, ccgLayer);
        callback(undefined, "\n"+dateTimeNow()+"\t^#^M^W CASPARCG ^ \tMedia Stopped:\t\t[Video]\t\tFile: "+ccgChannel+'-'+ccgLayer)
    }
}

// CCG CONNECTOR
function ccgConnector(callback){
    
    // CASPARCG SETUP NEW CONNECTION
    if(CasparCG_Connection == null){
        CasparCG_Connection = new CasparCG({
            host: globalSettings.CasparCG.server,
            port: globalSettings.CasparCG.port_AMCP,
            autoConnect: false,
            onError: function(err){
                console.log(err);         
            },
            onConnectionChanged: function(ccgConnectionChanged){                
                if(ccgConnectionChanged === true){
                  callback();
                }
                if(ccgConnectionChanged === false){
                  callback('disconnected');
                  CasparCG_Connection = null;
                }     
            }
        });
    
        // CASPARCG SETUP CONNECT
        CasparCG_Connection.connect();
    }    
}

// OSC Client
function ccgConnectOSC(){
    var oscSocket = udpConnection.createSocket("udp4", function(msg, info) {
      var error, error1;
      try {

        // CASPARCG - GET OSC
        oscMessages = oscClient.fromBuffer(msg);
        oscMessages.elements.forEach(function(oscMessage){

            // CHECK IF VIDEO PRODUCER IS PRESENT
            if(oscMessage.address == '/channel/' + globalSettings.CasparCG.ccgChannel + '/stage/layer/' + globalSettings.CasparCG.ccgLayer_video_01 + '/foreground/producer'){
                var videoPresent = false;
                if(oscMessage.args[0].value != 'empty'){
                    videoPresent = true;
                }
                else{
                    videoPresent = false;
                }

                // CHECK IF VIDEO STATUS HAS CHANGED
                if(videoPresent != timecodeVars.videoPresent){
                    timecodeVars.videoPresent = videoPresent;                    

                    // SEND TO WEB
                    IOSendData(['web'], 'timing', timecodeVars);
                }
            }  
            
            // GET TIMING
            if(oscMessage.address == '/channel/' + globalSettings.CasparCG.ccgChannel + '/stage/layer/' + globalSettings.CasparCG.ccgLayer_video_01 + '/foreground/file/time'){
                var currentTime = Number(oscMessage.args[0].value.toFixed(3));
                var currentDuration = Number(oscMessage.args[1].value.toFixed(3));
                
                // CHECK IF TIME HAS CHANGED
                if(currentTime != timecodeVars.currentTime || currentDuration != timecodeVars.currentDuration){
                    calculateTime(currentTime, currentDuration);                   
                }
            }  
        });

        // CASPARCG - CATCH ERROR
      } catch (error1) {
        error = error1;
      }
    });
  
    // SOCKET.IO - BIND CONNECTION
    oscSocket.bind(globalSettings.CasparCG.port_OSC);
}

// Calculate Multiple Timings
function calculateTime(currentTime, currentDuration){
    
    // Raw Time
    timecodeVars.currentTime = currentTime;
    timecodeVars.currentDuration = currentDuration;

    // Time To TC
    timecodeVars.currentTimeConverted = msToTime(currentTime * 1000);
    timecodeVars.currentDurationConverted = msToTime(currentDuration * 1000);

    // Calculate Countdown
    timecodeVars.currentCountDown = currentDuration - currentTime;
    timecodeVars.currentCountDown = timecodeVars.currentCountDown.toFixed(3);
    timecodeVars.currentCountDownConverted = msToTime(timecodeVars.currentCountDown * 1000);

    // Calculate Progress
    timecodeVars.currentProgressPrecent = ((currentTime / currentDuration) * 100).toFixed(1);

    // SEND TO WEB
    IOSendData(['web'], 'timing', timecodeVars); 
}

// MS to TC converter
function msToTime(duration) {
    var frames = parseInt((duration%1000)/msPerFrame)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);
    frames = (frames < 10) ? "0" + frames : frames;
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes + ":" + seconds + ":" + frames;
}

// DATE TIME NOW
function dateTimeNow(){
    var MyDate = new Date();
    var MyDateString;
    MyDate.setDate(MyDate.getDate());
    MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth()+1)).slice(-2) + '-' + (' 0' + MyDate.getDate()).slice(-2) + ' ' + (' 0' + MyDate.getHours()).slice(-2) + ':' + (' 0' + MyDate.getMinutes()).slice(-2) + ':' + (' 0' + MyDate.getSeconds()).slice(-2);
    return MyDateString;
}
  
// DATE NOW
function dateNow(){
    var MyDate = new Date();
    var MyDateString;
    MyDate.setDate(MyDate.getDate());
    MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth()+1)).slice(-2) + '-' + (' 0' + MyDate.getDate()).slice(-2);
    return MyDateString;
}
  