module.exports = function(io){

io.use( async (socket, next) => {
  let userId = socket.request._query['userId'];
  let userSocketId = socket.id;      
  next();    
  
  /* TODO: Ajouter UserSocket ID en base de données */
  // EX UPDATE user SET socketid = ?, online= ? WHERE id = ?`;
});

let userList = []
// Établissement de la connexion à Socket.io
io.on('connection', (socket) =>{
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notif', `Bye ${socket.id}`);

      userList = userList.filter(user => user.id !== socket.id)
      io.emit('exit', userList);
    });
  
    socket.on('message', ({text, from}) => {
      io.emit('message', `${from} : ${text}`);
    });
  
    socket.on('private', ({text, to,from}) => {
      io.emit(to, `${from} : text ${text}`);
    });

    userList.push({id: socket.id, name: socket.id})
    io.emit('enter', userList);
  
    console.log(`Connecté au client ${socket.id}`)
    io.emit('notif', `Bonjour à toi ! ${socket.id}`);
  })
}