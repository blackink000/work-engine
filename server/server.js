// Handle middleware
const express = require('express');
// Create middleware
const app = express();
// Create the server
var http = require('http').Server(app);
//Create a socket.io instance attached to the server
var io = require('socket.io')(http);
// Parse req.body
const bodyParser = require('body-parser');
// Use path.join
const path = require('path');
// Import api router
// const apiRouter = require('./routers/apiRouter')
// Import mongoose
const mongoose = require('mongoose');
let dbController;

// Listen on port 3000
http.listen(3000, function(){
  console.log('listening on *:3000');
});

// Open socket and listen for connections

function openSocket() {
  return new Promise((resolve, reject) => {
    io.on('connection', function (socket) {
      dbController = require('./controllers/dbController')(socket);
      console.log('Hello');
      socket.emit('news', { hello: 'world' });
      socket.on('my other event', function (data) {
        console.log(data);
      });
      resolve(socket);
    });
    // resolve(socket);
  })
}

async function wrapper(req, res) {
  await openSocket();
}

wrapper();

// app.use(wrapper);
// Route requests to to '/api' router handling endpoint
// app.post('/api/receive', dbController.save);

// Sets the db to 'work_engine'
const mongoURI = 'mongodb://localhost/work_engine';
mongoose.connect(mongoURI);

// Allows us to read req.body as an object
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Send index.html to a request for the homepage
app.use(express.static(__dirname + '/../client/'));

// Route requests to to '/api' router handling endpoint
// app.use('/api', apiRouter);

// Intercept all requests to an endpoint without a route within '/'
app.all('*', (req, res, next) => {
  console.log('catch all on the root');
  err = new Error('index.js - default catch all route - not found');
  err.functionName = 'server.js';
  err.status = 404;
  next(err);
});

// If an error is passed into next() by any route, thise function gets invoked and sends
// an error message to the client
app.use((err, req, res, next) => {
  const error = err.functionName ? `${err.functionName} ${err}` : err;
  const errorStatus = err.status ? err.status : 500;
  res.status(errorStatus).end(`Server.js - ${error}`);
});

// console.log('This is server files and io: ', io);
// module.exports = io;