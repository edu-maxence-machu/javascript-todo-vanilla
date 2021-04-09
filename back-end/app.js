const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('1. Réception de la requête');
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: '3. Vous recevez une réponse HTTP 201' });
  next();
});

app.use((req, res, next) => {
  console.log('4. Nous avons envoyé la réponse');
});

module.exports = app;