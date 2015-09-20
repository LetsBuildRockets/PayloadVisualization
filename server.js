var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SerialPort = require("serialport").SerialPort

if(process.argv[2]) {
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
