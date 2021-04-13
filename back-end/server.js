const http = require('http');
const app = require('./app');

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"]
  }
})

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Établissement de la connexion à Socket.io
io.on('connection', (socket) =>{
  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
    //io.emit('message', `Bye ${socket.id}`);
  });

  console.log(`Connecté au client ${socket.id}`);

  socket.on('join', (prev, room) => {
    
    if(prev !== ''){
      socket.leave(prev);
    }    
    socket.join(room);

  });

  socket.on('message', (msg) => {
    // On envoie un message à la room sélectionnée
    console.log('room:', msg.room);
    console.log('message:', msg.message);
    io.in(msg.room).emit('message', msg.message);
  });

  io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
  });
  
  io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
  });
})

server.listen(port);
