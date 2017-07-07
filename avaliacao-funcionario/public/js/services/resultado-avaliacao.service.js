(function () {
    'use strict';

    angular
        .module('app')
        .factory('ResultadoAvaliacaoService', ResultadoAvaliacaoService);

    ResultadoAvaliacaoService.$inject = ['$http'];
    function ResultadoAvaliacaoService($http) {
        var service = {
            media: media,
            compararComDepartamento: compararComDepartamento
        };

        var URL = '/api/funcionarios/';

        return service;

        function media(id, competencia) {
            return $http.get(URL + id + '/avaliacoes/' + competencia + '/media');
        }

        function compararComDepartamento(id, competencia) {
            return $http.get(URL + id + '/avaliacoes/' + competencia + '/comparativo-departamento');
        }

    }
})();