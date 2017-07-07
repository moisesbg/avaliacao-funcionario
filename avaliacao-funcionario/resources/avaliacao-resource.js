var mongoose = require('mongoose');

var modelo = mongoose.model('avaliacoes');

module.exports = function (app) {

    function retornarDadosOuErro(resp, codigoHttp, dados) {
        return resp.status(codigoHttp).json(dados);
    }

    function identificarCodigoERetornarDados(resp, dados) {
        if(!dados || dados.length === 0) {
            return retornarDadosOuErro(resp, 204, dados);
        }
        return retornarDadosOuErro(resp, 200, dados);
    }
        
    app.get('/api/avaliacoes', function (req, resp) {
        modelo.find()
            .then(function (dados) {
                return identificarCodigoERetornarDados(resp, dados);    
                
            }, function (erro) {
                return retornarDadosOuErro(resp, 500, erro);
            });
    });
    
    app.get('/api/avaliacoes/:id', function(req, resp) {
        modelo.findById(req.params.id)
            .then( function(dados) {
                return identificarCodigoERetornarDados(resp, dados);
            }, function(erro) {
                return retornarDadosOuErro(resp, 500, err);
            });
    });

    app.post('/api/avaliacoes', function(req, resp) {
        modelo.create(req.body)
            .then(function (dados) {
                return retornarDadosOuErro(resp, 201, dados);
            }, function (erro) {
                return retornarDadosOuErro(resp, 500, erro);
            });
    });

    app.put('/api/avaliacoes/:id', function( req, resp) {
        modelo.findById(req.params.id)
            .then( function(dados) {
                if(!dados || dados.length === 0) {
                    return retornarDadosOuErro(resp, 204, dados);
                } 
                modelo.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators : true })
                    .then( function(dados) {
                        return retornarDadosOuErro(resp, 200, dados);
                    }, function (erro) {
                        return retornarDadosOuErro(resp, 500, erro);
                    });

            }, function (erro) {
                return retornarDadosOuErro(resp, 500, erro);
            });
        
    });

    app.delete('/api/avaliacoes/:id', function( req, resp) {
        modelo.findById(req.params.id)
            .then( function(dados) {
                if(!dados || dados.length === 0) {
                    return retornarDadosOuErro(resp, 204, dados);
                }
                modelo.findByIdAndRemove(req.params.id)
                    .then( function(dados) {
                        return retornarDadosOuErro(resp, 200, dados);
                    }, function(erro) {
                        return retornarDadosOuErro(resp, 500, dados);
                    });

            }, function(erro) {
                return retornarDadosOuErro(resp, 500, dados);
            });
    });
    
};
