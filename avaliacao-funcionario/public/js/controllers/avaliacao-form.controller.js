(function () {
  'use strict';

  angular
    .module('app')
    .controller('AvaliacaoFormController', AvaliacaoFormController);

  AvaliacaoFormController.$inject = ['AvaliacaoService', '$location', '$routeParams', '$scope'];
  function AvaliacaoFormController(AvaliacaoService, $location, $routeParams, $scope) {
    var vm = this;
    vm.avaliacao = {};
    
    vm.questao = null;
    var questaoSelecionada = -1;

    vm.salvar = salvar;
    vm.salvarQuestao = salvarQuestao;
    vm.adicionarQuestao = adicionarQuestao;
    vm.editarQuestao = editarQuestao;
    vm.removerQuestao = removerQuestao;

    activate();

    function activate() {
      if ($routeParams.id) {
        AvaliacaoService.findById($routeParams.id)
          .success(function (data) {
            vm.avaliacao = data;
          });
      }
    }

    function salvar() {
      AvaliacaoService.save(vm.avaliacao)
        .success(function () {
          $location.path('/avaliacoes');
        });
    }

    function salvarQuestao() {
      vm.avaliacao.questoes = vm.avaliacao.questoes || [];
      vm.avaliacao.questoes[questaoSelecionada] = vm.questao;
      questaoSelecionada = -1;
      vm.questao = null;
    }

    function adicionarQuestao() {
      vm.questao = null;
      questaoSelecionada = (vm.avaliacao.questoes && vm.avaliacao.questoes.length) || 0;
    }

    function editarQuestao(questao) {
      questaoSelecionada = vm.avaliacao.questoes.indexOf(questao);
      vm.questao = angular.copy(questao);
    }

    function removerQuestao(questao) {
      confirmBox('Tem certeza que deseja remover a questão?', function () {
        let pos = vm.avaliacao.questoes.indexOf(questao);
        vm.avaliacao.questoes.splice(pos, 1);
        $scope.$apply();
      });
    }
  }
})();