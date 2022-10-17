const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
  });

app.use(express.json());


app.post('/todos', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Todo créé !'
  });
});

app.delete('/todos/:id', (req, res, next) => {
  res.end(`Je supprime ${req.params.id}`)
})

app.put('/todos/:id', (req, res, next) => {
  res.end(`Je modifie ${req.params.id}`)
})

app.use('/todos', (req, res, next) => {
    const stuff = [
      {
        title: "Cours Node.js",
        completed: false
      },
      {
        title: "Exercice matinée",
        completed: false
      },
    ];
    res.status(200).json(stuff);
  });

module.exports = app;