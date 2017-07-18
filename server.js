var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

if(process.argv[2]) {
  var SerialPort = require("serialport").SerialPort

  var serialPort = new SerialPort(process.argv[2], {
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
} else {
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

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('data', 123);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
