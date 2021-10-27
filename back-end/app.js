require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const sTodo = require('./models/todo');
const socketIo = require('socket.io');



// export one function that gets called once as the server is being initialized
module.exports = function(app, server) {

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


app.post('/todos', (req, res, next) => {

  const todo = new sTodo({...req.body});
  todo.save().then(() => {
    res.status(201).json({
      message: 'Todo enregistrée'
    })
  }).catch((error) => {
    res.status(400).json({error})
  })
});

app.get('/todos', (req, res, next) => {
  sTodo.find()
  .then(todos => res.status(200).json(todos))
  .catch(error => res.status(400).json({ error }));
});


app.get('/todos/:id', (req, res, next) => {
  sTodo.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});



app.delete('/todos/:id', (req, res, next) => {
  sTodo.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Todo supprimée'}))
    .catch(error => res.status(400).json({ error }));
});


app.put('/todos/:id', (req, res, next) => {
  sTodo.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Todo modifiée'}))
    .catch(error => res.status(400).json({ error }));
});
}

