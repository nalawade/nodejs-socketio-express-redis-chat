var http = require('http'),  
iosocket = require('socket.io');

var server = http.createServer(function(request, response) {  
  response.writeHeader(200, {"Content-Typ": "text/html"});
  response.write("Welcome");
  response.end();
}).listen(1234);

console.log(server);

var io = iosocket.listen(server); 
console.log('-------------');
console.log(io);
io.sockets.on('connection', function (socket) {
	console.log('Working');
  socket.join("farm");
  socket.on('msg', function (data) {
    socket.broadcast.to("farm").emit("update", data);
  });
});
