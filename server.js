var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/* Main server startup stuff */
if(process.argv[2] == "serialport" ) {

  if(process.argv[3]){
    serialPortMode(process.argv[3]);
  } else {
    console.log('please include a serial port');
    process.exit();
  }
} else if(process.argv[2] == "websocket" ) {
  webSocketMode();
} else if(process.argv[2] == "playback" ) {
  console.log("yayy");
} else {
  console.log("Please specify a mode: serialport <port> | websocket | playback <file>");
  process.exit();
}

/* Serve Files */
app.get('/ShareTechMono-regular.ttf', function(req, res){
  res.sendFile(__dirname + '/ShareTechMono-regular.ttf');
});

app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});

app.get('/processing.js', function(req, res){
  res.sendFile(__dirname+'/processing.js');
});

app.get('/rocket.pde', function(req, res){
  res.sendFile(__dirname+'/rocket.pde');
});

app.get('/style.css', function(req, res){
  res.sendFile(__dirname+'/style.css');
});

app.get('/visualization-run.js', function(req, res){
  res.sendFile(__dirname+'/visualization-run.js');
});

/* server status */
io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('data', 123);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


/* This Visualization service can be set up in different modes! */

function serialPortMode(port){
  // This mode was originally used at Maker Faire 2015, where the payload was connected directly over USB serial.
  // TODO: i couldn't successfully install SerialPort so idk if this even works

  var SerialPort = require("serialport").SerialPort

  var serialPort = new SerialPort(port, {
    baudrate: 115200
  });

  serialPort.on("open", function () {
    console.log('open');
    var cmd = '';
    serialPort.on('data', function(data) {
      cmd = cmd.concat(data.toString());
      if(cmd.indexOf('\n', cmd.length - 1) !== -1) {
        try {
          var obj = JSON.parse(cmd);
          console.log(obj);
          io.sockets.emit('data', obj);
        } catch (e) {
          console.log(cmd);
        }
        cmd = '';
      }
    });
  });
}

function webSocketMode(){
  // This mode was used with the HorizonTracker payload project, @poojpooj Summer 2017
  // TODO: I also didn't test this
  var WebSocketServer = require('ws').Server;
  var server = require('http').createServer();
  var wss = new WebSocketServer({server: server, path: '/foo'});
  wss.on('connection', function(ws) {
      console.log('/foo connected');
      ws.on('message', function(data, flags) {
          if (flags.binary) { return; }
          console.log('>>> ' + data);
          var obj = {'pitch':0, 'alt':0, 'temp':0, 'roll':parseFloat(data), 'heading':0, 'xLin':0, 'yLin':0, 'zLin':0};
          io.sockets.emit('data', obj);
      });
      ws.on('close', function() {
        console.log('Connection closed!');
      });
      ws.on('error', function(e) {
      });
  });
  server.listen(8126);
  console.log('Listening on port 8126...');
}
