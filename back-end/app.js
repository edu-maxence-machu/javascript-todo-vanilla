require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sClick = require('./models/click');

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

require('./socket/socket')(io);

app.use(function(req, res, next) {req.io = io; next(); });

app.get('/stats/days', (req, res, next) => {

  /*
  Un indice: https://stackoverflow.com/a/15659727 
  */
  sClick.aggregate(
    [
      { $group : {
        _id: {
            year : { $year : "$timestamp" },        
            month : { $month : "$timestamp" },        
            day : { $dayOfMonth : "$timestamp" },
        },
        count: { $sum: 1 },
    }}
    ],

    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result); 
      }
    }
  );
})

app.get('/stats/avg/days', (req, res, next) => {

  /*
  Un indice: https://stackoverflow.com/a/15659727 
  */
  sClick.aggregate(
    [
      { $group : {
        _id: {
            year : { $year : "$timestamp" },        
            month : { $month : "$timestamp" },        
            day : { $dayOfMonth : "$timestamp" },
        },
        count: { $sum: 1 }
    }}
    ],
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        /*
        Calcul de la moyenne
        */ 
        // On crée un tableau avec les résultats [17, 2, 1 ,...] 

        let results = result.map((res) => {return res.count});

        // Utilisation de la fonction reduce pour calculer la somme 
        // Option: utiliser un for
        
        let sum = results.reduce((prev, next) => {
          return prev + next
        });

        // Calcul de la moyenne
        let avg = sum / results.length;
        res.json({avg: avg});
      }
    }
  );
})

app.get('/stats/avg/session', (req, res, next) => {

  /*
  Un indice: https://stackoverflow.com/a/15659727 
  */
  sClick.aggregate(
    [
      { $group : {
        _id: "$sessionid",
        count: { $sum: 1 }
    }}
    ],

    function(err, result) {
      if (err) {
        res.send(err);
      } else {

        /*
        Calcul de la moyenne
        */ 
        // On crée un tableau avec les résultats [17, 2, 1 ,...] 
        let results = result.map((res) => {return res.count});

        // Utilisation de la fonction reduce pour calculer la somme 
        // Option: utiliser un for
        let sum = results.reduce((prev, next) => {
          return prev + next
        });

        let avg = sum / result.length

        res.json({avg: avg}); 
      }
    }
  );
})

app.get('/stats/avg/user', (req, res, next) => {

  /*
  Un indice: https://stackoverflow.com/a/15659727 
  */
  sClick.aggregate(
    [
      { $group : {
        _id: "$userid",
        count: { $sum: 1 }
    }}
    ],

    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        /*
        Calcul de la moyenne
        */ 
        // On crée un tableau avec les résultats [17, 2, 1 ,...] 
        let results = result.map((res) => {return res.count});

        // Utilisation de la fonction reduce pour calculer la somme 
        // Option: utiliser un for
        let sum = results.reduce((prev, next) => {
          return prev + next
        });

        let avg = sum / result.length

        res.json({avg: avg}); 
      
      }
    }
  );
})

}