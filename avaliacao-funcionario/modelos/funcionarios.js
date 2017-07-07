var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelo = new Schema({
        nome: {
                type: String,
                required: [true, 'Você deve informar o nome do funcionário']
        },

        cargo: {
                type: String,
                required: [true, 'Você deve informar o cargo do funcionário']
        },

        departamento: {
                codigo: {
                        type: String,
                        required: [true, 'Você deve informar o código do departamento onde o funcionário está lotado']
                },
                nome: {
                        type: String,
                        required: [true, 'Você deve informar o nome do departamento onde o funcionário está lotado']
                }
        },

        dataAdmissao: {
                type: Date,
                required: [true, 'Você deve informar a data de admissão do funcionário']
        },

        gestor: {
                type: Schema.Types.ObjectId,
                ref: 'funcionarios'
        },

        avaliacoes: [
                {
                        competencia : String, 
                        avaliacao: {
                                type: Schema.Types.ObjectId,
                                ref: 'avaliacoes'
                        },
                        notasQuestoes: [Number]
                }

        ]
});

modelo.index({ '$**': 'text' });

mongoose.model('funcionarios', modelo);
