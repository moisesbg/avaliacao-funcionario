var mongoose = require('mongoose');

module.exports = function (resource) {

    function retornarDados(resp, codigoHttp, dados) {
        return resp.status(codigoHttp).json(dados);
    }

    return function(app) {

        var modelo = mongoose.model(resource);
        
        app.get('/api/' + resource, function (req, resp) {
            modelo.find()
                    .populate('gestor', ['nome'])
                .then(function (dados) {
                    console.log(dados);
                    if(!dados || dados.length === 0) {
                        return retornarDados(resp, 204, dados);
                    }
                    return retornarDados(resp, 200, dados);
                }, function (erro) {
                    return retornarDados(resp, 500, erro);
                });
        });
        
        app.get('/api/' + resource +'/:id', function(req, resp) {
            modelo.findById(req.params.id)
                    .populate('gestor', ['nome'])
                .then( function(dados) {
                    if(!dados || dados.length === 0) {
                        return retornarDados(resp, 204, dados);
                    }
                    return retornarDados(resp, 200, dados);
                }, function(erro) {
                    return retornarDados(resp, 500, err);
                });
        });
        
        app.post('/api/' + resource, function(req, resp) {
            modelo.create(req.body)
                .then(function (dados) {
                    return retornarDados(resp, 201, dados);
                }, function (erro) {
                    return retornarDados(resp, 500, erro);
                });
        });

        app.put('/api/' + resource + '/:id', function( req, resp) {
            modelo.findById(req.params.id)
                .then( function(dados) {
                    if(!dados || dados.length === 0) {
                        return retornarDados(resp, 204, dados);
                    } 
                    modelo.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators : true })
                        .then( function(dados) {
                            return retornarDados(resp, 200, dados);
                        }, function (erro) {
                            return retornarDados(resp, 500, erro);
                        });

                }, function (erro) {
                    return retornarDados(resp, 500, erro);
                });
            
        });

        app.delete('/api/' + resource + '/:id', function( req, resp) {
            modelo.findById(req.params.id)
                .then( function(dados) {
                    if(!dados || dados.length === 0) {
                        return retornarDados(resp, 204, dados);
                    }
                    modelo.findByIdAndRemove(req.params.id)
                        .then( function(dados) {
                            return retornarDados(resp, 200, dados);
                        }, function(erro) {
                            return retornarDados(resp, 500, dados);
                        });

                }, function(erro) {
                    return retornarDados(resp, 500, dados);
                });
        });
    };
    
};
