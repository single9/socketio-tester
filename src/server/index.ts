import socketio = require('socket.io');
import http = require('http');
import express = require('express');
import pack = require('../package.json');

const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.set('views',  path.join(__dirname, 'views'));
app.use('/public/', express.static(path.join(__dirname, 'views', 'assets')));

app.use((req, res, next) => {
  res.locals.version = (<any>pack).version;
  next();
})

app.get('/', (req, res) => {
  res.render('index', {
    hello: 'Hello!'
  });
});

io.on('connection', (socket) => {

  socket.emit('greet', 'Hello! ' + socket.id);

  socket.on('test', (d: any) => {
    socket.emit('test', d || 'Hello! (from server)');
  });
});

server.listen(3000);