(function() {
  'use strict';

  angular.module('app', [
    'ngRoute',
    'ui.bootstrap',
    'mgo-angular-wizard'
  ]).config(AppConfig);

  AppConfig.$inject = ['$routeProvider'];
  function AppConfig($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
      })
      .when('/avaliacoes', {
        templateUrl: 'partials/avaliacao-list.html',
        controller: 'AvaliacaoListController',
        controllerAs: 'vm'
      })
      .when('/avaliacoes/new', {
        templateUrl: 'partials/avaliacao-form.html',
        controller: 'AvaliacaoFormController',
        controllerAs: 'vm'
      })
      .when('/avaliacoes/:id', {
        templateUrl: 'partials/avaliacao-form.html',
        controller: 'AvaliacaoFormController',
        controllerAs: 'vm'
      })
      .when('/funcionarios', {
        templateUrl: 'partials/funcionario-list.html',
        controller: 'FuncionarioListController',
        controllerAs: 'vm'
      })
      .when('/funcionarios/new', {
        templateUrl: 'partials/funcionario-form.html',
        controller: 'FuncionarioFormController',
        controllerAs: 'vm'
      })
      .when('/funcionarios/:id', {
        templateUrl: 'partials/funcionario-form.html',
        controller: 'FuncionarioFormController',
        controllerAs: 'vm'
      })
      .when('/resultado-avaliacao', {
        templateUrl: 'partials/resultado-avaliacao-form.html',
        controller: 'ResultadoAvaliacaoController',
        controllerAs: 'vm'

      })
      .otherwise('/');
  }
})();