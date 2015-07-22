var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
