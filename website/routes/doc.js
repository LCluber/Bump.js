var express = require('express');
var path    = require('path');
var app     = express();

//app.use(express.static('doc'));
app.use('/', express.static(path.join(__dirname, '../../doc')));

module.exports = app;
