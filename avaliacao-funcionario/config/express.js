var express = require('express'); //biblioteca node
var bodyParser = require('body-parser'); //bibiloteca node
var consign = require('consign');

var app = express();

app.use(express.static('./public'));
app.use(bodyParser.json()); //cria um corpo para a request

consign()
    .include('modelos')
    .then('resources')
    .into(app);

module.exports = app;