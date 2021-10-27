const express = require('express');
const app = express();
app.set('port', 3000);


const server = require('http').Server(app);
server.listen(3000);

require('./app.js')(app, server);