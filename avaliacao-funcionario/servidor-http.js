var http = require('http'); //biblioteca node
var app = require('./config/express.js');
var database = require('./config/banco-dados.js');
database('mongodb://127.0.0.1/avaliacoes'); //trocar por localhost e verificar se roda quando tiver rede

var port = 4000;

http.createServer(app).listen(port, function() {
    console.log('Servidor iniciado na porta',port);
})
