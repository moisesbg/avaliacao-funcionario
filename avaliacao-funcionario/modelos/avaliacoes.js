var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelo = new Schema({
    tipo : { type: String, 
             enum : ['Avaliação gestor', 'Auto-avaliação', 'Avaliação do colega', 'Avaliação do subordinado'],
             required: [true, 'Você deve informar o tipo da avaliação']
    },
    
    questoes : [String],
    
});

mongoose.model('avaliacoes', modelo);
