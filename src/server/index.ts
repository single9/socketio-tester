import socketio = require('socket.io');
import http = require('http');
import express = require('express');
import pack = require('../package.json');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const rootPath = __dirname;

app.set('view engine', 'ejs');
app.set('views', rootPath + '/views');
app.use('/public/', express.static(__dirname + '/assets'));

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
  socket.emit('greet', 'Hello!');
});

server.listen(3000);