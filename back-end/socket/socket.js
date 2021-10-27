module.exports = function(io){
    // Établissement de la connexion à Socket.io
io.on('connection', (socket) =>{
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notif', `Bye ${socket.id}`);
    });
  
    socket.on('message', (msg) => {
      console.log(msg);
      io.emit('message', msg);
    });
  
    console.log(`Connecté au client ${socket.id}`)
    io.emit('notif', `Bonjour à toi ! ${socket.id}`);
  })
}