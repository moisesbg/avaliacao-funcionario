(function () {
    'use strict';

    angular
        .module('app')
        .controller('ResultadoAvaliacaoController', ResultadoAvaliacaoController);

    ResultadoAvaliacaoController.$inject = ['ResultadoAvaliacaoService']
    function ResultadoAvaliacaoController(ResultadoAvaliacaoService) {
        var vm = this;
        vm.consultar = consultar;
        vm.id = '';
        vm.competencia = '';
        vm.resultado = '';
        vm.erro = '';

        function consultar() {
            vm.erro = '';
            if(vm.id === null || vm.id === undefined || vm.id ===""){
                alert('Você deve selecionar o funcionário');
                return;
            }
            if(vm.competencia === null || vm.competencia === undefined || vm.competencia ===""){
                alert('Você deve selecionar a competência');
                return;
            }
            ResultadoAvaliacaoService.compararComDepartamento(vm.id, vm.competencia)
                .success(function (data) {
                    vm.media = data.media;
                    vm.mediaDepartamento = data.mediaDepartamento;
                    if(vm.media >= vm.mediaDepartamento){
                        vm.resultado = 'Aprovado';
                    } else {
                        vm.resultado = 'Reprovado';
                    }
                })
                .error(function (erro) {
                    vm.erro = erro.slice(erro.indexOf("<pre>") + 5, erro.indexOf("</pre>"));
                });
        }
    }
})();