var express = require('express');
var app = require('express')();
var favicon = require('favicon');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = names = {};

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use('/scripts', express.static(__dirname + '/scripts/'));

function logData(message) {
  var d = new Date();
  var time = ' [' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '] ';

  console.log(time + message);
}

logData("Chat server booting...");

io.on('connection', function(socket){
    socket.on('join', function(user) {
      logData("User " + user[2] + " has connected to channel " + user[0] + ".");
      socket.userId = user[1];
      socket.userName = user[2];

      users[user[1]] = socket;

      names[user[1]] = {
        'name': user[2],
        'socketId': socket.id,
      };

      function updateNames() {
        io.emit('chat.' + user[0] + '.names', names);
      }

      updateNames();

      socket.on('chat', function(payload) {
        io.emit('chat.' + payload[0], payload);
        logData(user[2] + ' on channel ' + user[0] + ' says: "' + payload[2] + '".');
      });
    });

  socket.on('disconnect', function(){
    logData("User disconnected.");
    //updateNames();
    if(!socket.name) return;

    delete users[user[1]];
    delete names[user[1]];
  });
});



http.listen(3000, function() {
  logData("Chat server started.");
});
