var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;
var parseParams = require('../utils/parse-params');

var modelo = mongoose.model('funcionarios');
var avaliacaoModelo = mongoose.model('avaliacoes');

module.exports = function (app) {

    function retornarDadosOuErro(resp, codigoHttp, dados) {
        return resp.status(codigoHttp).json(dados);
    }

    function identificarCodigoERetornarDados(resp, dados) {
        if (!dados || dados.length === 0) {
            return retornarDadosOuErro(resp, 204, dados);
        }
        return retornarDadosOuErro(resp, 200, dados);
    }


    function retornarFuncionarioComAvaliacoesAgrupadasNumaCompetencia(funcionarioId, competencia) {
        return modelo.aggregate([
            { $match: { _id: new ObjectId(funcionarioId) } },
            { $unwind: "$avaliacoes" },
            { $match: { "avaliacoes.competencia": { $in: [competencia] } } },
            {
                $group: {
                    "_id": { "id": "$_id", "nome": "$nome", "gestor": "$gestor", "departamento": "$departamento" },
                    avaliacoes: { $push: "$avaliacoes" }
                }
            }
        ]);
    }

    function retornarDepartamentoComAvaliacoesAgrupadasNumaCompetencia(codigoDepartamento, competencia) {
        return modelo.aggregate([
            { $match: { "departamento.codigo": codigoDepartamento } },
            { $unwind: "$avaliacoes" },
            { $match: { "avaliacoes.competencia": { $in: [competencia] } } },
            { $group: { "_id": { "depto": "$departamento.codigo" }, avaliacoes: { $push: "$avaliacoes" } } }
        ]);
    }

    function calcularMediaDepartamentoNaCompetencia(funcionarioMedia, competencia) {
        return Promise.resolve(retornarDepartamentoComAvaliacoesAgrupadasNumaCompetencia(funcionarioMedia._id.departamento.codigo, competencia))
            .then(function (dados) {
                return dados[0];
            })
            .then(function (departamento) {
                somaNotas = 0;
                qtdNotas = 0;
                for (var ind = 0; ind < departamento.avaliacoes.length; ind++) {
                    for (var index = 0; index < departamento.avaliacoes[ind].notasQuestoes.length; index++) {
                        somaNotas += departamento.avaliacoes[ind].notasQuestoes[index];
                        qtdNotas++;
                    }
                }
                var resultado = {};
                resultado = JSON.parse(JSON.stringify(funcionarioMedia));
                resultado.mediaDepartamento = (somaNotas / qtdNotas).toFixed(2);
                return resultado;
            });
    }

    function calcularMediaFuncionarioNaCompetencia(funcionario) {
        somaNotas = 0;
        qtdNotas = 0;
        for (var ind = 0; ind < funcionario.avaliacoes.length; ind++) {
            for (var index = 0; index < funcionario.avaliacoes[ind].notasQuestoes.length; index++) {
                somaNotas += funcionario.avaliacoes[ind].notasQuestoes[index];
                qtdNotas++;
            }
        }
        var resultado = {};
        resultado = JSON.parse(JSON.stringify(funcionario));

        resultado.media = (somaNotas / qtdNotas).toFixed(2);
        return resultado;
    }


    function retornarInformacoesCompletasDasAvaliacoesDoFuncionario(funcionario) {

        var vetorPromise = [];

        for (var ind = 0; ind < funcionario.avaliacoes.length; ind++) {
            vetorPromise.push(avaliacaoModelo.findById(funcionario.avaliacoes[ind].avaliacao));
        }

        return Promise.all(vetorPromise)
            .then(function (avaliacoes) {
                for (var ind = 0; ind < funcionario.avaliacoes.length; ind++) {
                    funcionario.avaliacoes[ind].avaliacao = avaliacoes[ind];
                }
                return funcionario;
            });

    }

    app.get('/api/funcionarios', function (req, resp) {
        var fields = {
            score: { $meta: 'textScore' },
            _id: 1,
            nome: 1,
            cargo: 1,
            departamento: 1,
            dataAdmissao: 1,
            gestor: 1,
            avaliacoes:1
        };
        modelo.find(parseParams(req.query.filter), fields, { sort: { score: {$meta: 'textScore'}, nome: 1 } })
            .populate('gestor', ['nome'])
            .then(function (dados) {
                return identificarCodigoERetornarDados(resp, dados);

            }, function (erro) {
                return retornarDadosOuErro(resp, 500, erro);
            });
    });

    app.get('/api/funcionarios/:id', function (req, resp) {
        modelo.findById(req.params.id)
            .populate('gestor', ['nome'])
            .populate('avaliacoes.avaliacao', ['tipo', 'questoes'])
            .then(function (dados) {
                return identificarCodigoERetornarDados(resp, dados);
            }, function (erro) {
                return retornarDadosOuErro(resp, 500, err);
            });
    });

    app.get('/api/funcionarios/:id/avaliacoes', function (req, resp) {
        modelo.find({ "_id": req.params.id }, { nome: 1, gestor: 1, avaliacoes: 1 })
            .populate('gestor', ['nome'])
            .populate('avaliacoes.avaliacao', ['tipo', 'questoes'])
            .then(function (dados) {
                return identificarCodigoERetornarDados(resp, dados);
            }, function (erro) {
                return retornarDadosOuErro(resp, 500, dados);
            });

    });


    app.get('/api/funcionarios/:id/avaliacoes/:competencia', function (req, resp) {
        retornarFuncionarioComAvaliacoesAgrupadasNumaCompetencia(req.params.id, req.params.competencia)
            .then(function (dados) {
                return dados[0];
            })
            .then(function (funcionario) {
                return retornarInformacoesCompletasDasAvaliacoesDoFuncionario(funcionario);
            })
            .then(function (funcionarioCompleto) {
                var resultado = {};
                resultado = JSON.parse(JSON.stringify(funcionarioCompleto));

                for (var ind = 0; ind < funcionarioCompleto.avaliacoes.length; ind++) {

                    resultado.avaliacoes[ind].avaliacao.questoesComNotas = [];
                    for (var index = 0; index < funcionarioCompleto.avaliacoes[ind].avaliacao.questoes.length; index++) {
                        resultado.avaliacoes[ind].avaliacao.questoesComNotas.push({
                            questao: funcionarioCompleto.avaliacoes[ind].avaliacao.questoes[index],
                            nota: funcionarioCompleto.avaliacoes[ind].notasQuestoes[index]
                        });
                    }
                    delete resultado.avaliacoes[ind].avaliacao.questoes;
                    delete resultado.avaliacoes[ind].notasQuestoes;
                }

                return resp.json(resultado);
            })
            .catch(function (erro) {
                return resp.status(500).json(erro);
            });
    });


    app.get('/api/funcionarios/:id/avaliacoes/:competencia/media', function (req, resp) {
        retornarFuncionarioComAvaliacoesAgrupadasNumaCompetencia(req.params.id, req.params.competencia)
            .then(function (dados) {
                return dados[0];
            })
            .then(function (funcionario) {
                return calcularMediaFuncionarioNaCompetencia(funcionario);
            })
            .then(function (funcionarioMedia) {
                return resp.json(funcionarioMedia);
            })
            .catch(function (erro) {
                return resp.status(500).json(erro);
            });
    });

    app.get('/api/funcionarios/:id/avaliacoes/:competencia/comparativo-departamento', function (req, resp) {
        retornarFuncionarioComAvaliacoesAgrupadasNumaCompetencia(req.params.id, req.params.competencia)
            .then(function (dados) {
                return dados[0];
            })
            .then(function (funcionario) {
                return calcularMediaFuncionarioNaCompetencia(funcionario);
            })
            .then(function (funcionarioMedia) {
                return calcularMediaDepartamentoNaCompetencia(funcionarioMedia, req.params.competencia);
            })
            .then(function (funcionarioCompleto) {
                return resp.json(funcionarioCompleto);
            })
            .catch(function (erro) {
                return resp.status(500).json(erro);
            });
    });

    app.post('/api/funcionarios', function (req, resp) {
        modelo.create(req.body)
            .then(function (dados) {
                return retornarDadosOuErro(resp, 201, dados);
            }, function (erro) {
                return retornarDadosOuErro(resp, 500, erro);
            });
    });

    app.put('/api/funcionarios/:id', function (req, resp) {
        modelo.findById(req.params.id)
            .then(function (dados) {
                if (!dados || dados.length === 0) {
                    return retornarDadosOuErro(resp, 204, dados);
                }
                modelo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
                    .then(function (dados) {
                        return retornarDadosOuErro(resp, 200, dados);
                    }, function (erro) {
                        return retornarDadosOuErro(resp, 500, erro);
                    });

            }, function (erro) {
                return retornarDadosOuErro(resp, 500, erro);
            });

    });

    app.delete('/api/funcionarios/:id', function (req, resp) {
        modelo.findById(req.params.id)
            .then(function (dados) {
                if (!dados || dados.length === 0) {
                    return retornarDadosOuErro(resp, 204, dados);
                }
                modelo.findByIdAndRemove(req.params.id)
                    .then(function (dados) {
                        return retornarDadosOuErro(resp, 200, dados);
                    }, function (erro) {
                        return retornarDadosOuErro(resp, 500, dados);
                    });

            }, function (erro) {
                return retornarDadosOuErro(resp, 500, dados);
            });
    });

};
