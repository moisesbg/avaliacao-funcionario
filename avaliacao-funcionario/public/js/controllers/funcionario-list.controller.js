(function () {
  'use strict';

  angular
    .module('app')
    .controller('FuncionarioListController', FuncionarioListController);

  FuncionarioListController.$inject = ['FuncionarioService']
  function FuncionarioListController(FuncionarioService) {
    var vm = this;
    vm.funcionarios = [];
    vm.busca = '';

    vm.remover = remover;
    vm.buscar = activate;

    activate();

    function activate() {
      var query = vm.busca ? { $text: { $search: vm.busca } } : {};
      FuncionarioService.find(query)
        .success(function (data) {
          vm.funcionarios = data;
        });
    }

    function remover(funcionario) {
      confirmBox('Deseja realmente remover o funcionário "' + funcionario.nome + '"', function () {
        FuncionarioService.remove(funcionario._id)
          .success(function () {
            activate();
          });
      });

    }

  }
})();