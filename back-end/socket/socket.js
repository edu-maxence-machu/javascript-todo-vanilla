const sClick = require('../models/click');

module.exports = function(io){
// Établissement de la connexion à Socket.io
io.on('connection', (socket) =>{
    // Affichage du client qui vient de se connecter
    console.log(`Connecté au client ${socket.id}`)
    io.emit('notif', `Bonjour à toi ! ${socket.id}`);

    // Au chargement: envoie du nombre de clics
    // Récupéré depuis la fonction count de mongoose
    sClick.count({}, (err, count) => {
        console.log( "Number of docs: ", count );
        io.emit('plus-one', count)
    })

    // Listener sur la déconnexion
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notif', `Bye ${socket.id}`);
});
  
// On écoute les messages envoyés dans le canal "plus-one"
socket.on('plus-one', (id) => { 
    // Création de l'objet "click" de Mongoose (schéma)
    const click = new sClick({
        timestamp: new Date(),
        sessionid: socket.id,
        userid: id
    });

    // Sauvegarde dans la base de données
    click.save().then(() => {
        sClick.count({}, function(err, count){
            console.log( "Number of docs: ", count );
            io.emit('plus-one', count)
        });
    }).catch((error) => {
        console.log(error)
    })
    
});
})
}