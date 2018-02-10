// // Create the server
// var http = require('http').Server(app);
// //Create a socket.io instance attached to the server
// var io = require('socket.io')(http);

// const socketsController = {};

// socketsController.emit = (req, res, next) => {
//   io.emit('incoming product', res.locals.product);
//   next();
// };

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });