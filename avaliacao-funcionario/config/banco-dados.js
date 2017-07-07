var mongoose = require('mongoose');

module.exports = function (uri) {
    mongoose.connect(uri);

    mongoose.Promise = Promise;

    mongoose.connection.on('connected', function() {
        console.log('Foi aberta uma conexão do mongoose com', uri);
    });

    mongoose.connection.on('error', function(erro) {
        console.log('Ocorreu um erro no banco:',uri + '.','Detalhe do erro:',erro)
    });

    mongoose.connection.on('disconnected', function() {
        console.log('Foi encerrada a conexão do mongoose com', uri);
    });

    process.on('SIGINT', function() {
        mongoose.connection.close(function() {
            console.log('Encerrando a conexão do mongoose com', uri, 'porque a aplicação foi encerrada');
            process.exit(0);
        });
    });
};
