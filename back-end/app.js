require('dotenv').config();
const express = require('express');
const sDemo = require('./models/demo');

// export one function that gets called once as the server is being initialized
module.exports = function(app, server) {

const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('DB is OK'))
  .catch(() => console.log('DB failed'));
    
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
  });

app.use(express.json());

const io = require('socket.io')(server, {
  cors: {
    origin: "http://127.0.0.1:5501",
    methods: ["GET", "POST"]
  }
})

/*Nous pouvons utiliser la constante io pour le websocket*/
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
    io.emit('notification', `Bye ${socket.id}`);
  });

  console.log(`Connecté au client ${socket.id}`);
  io.emit('notification', `Bonjour, ${socket.id}`);

  socket.on('chat', (message) => {
    console.log(`Jai recu : ${message.data}` );

    io.emit('chat', message.data);
  })
/* 
  socket.on('join', (prev, room) => {
    
    if(prev !== ''){
      socket.leave(prev);
    }    
    socket.join(room);

  }); */

  /* socket.on('message', (msg) => {
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
  }); */
})



app.use(function(req, res, next) {req.io = io; next(); });

app.get('/demo', (req, res, next) => {
  sDemo.find()
    .then(demo => res.status(200).json(demo))
    .catch(error => res.status(400).json({ error }));
  });
}

