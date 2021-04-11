require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

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


app.post('/todos', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Todo créé !'
  });
});

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