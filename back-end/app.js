const express = require('express');

const app = express();

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