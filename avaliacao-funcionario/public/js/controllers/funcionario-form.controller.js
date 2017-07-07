(function () {
	'use strict';
	
	angular
	.module('app')
	.controller('FuncionarioFormController', FuncionarioFormController);
	
	FuncionarioFormController.$inject = ['FuncionarioService', 'AvaliacaoService', '$location', '$routeParams', '$scope'];
	function FuncionarioFormController(FuncionarioService, AvaliacaoService, $location, $routeParams, $scope) {
		var vm = this;
		vm.funcionario = {};

		
    	var avaliacaoSelecionada = -1;

		vm.avaliacao = {};
		vm.questoes  = [];
		vm.notas = [];

		vm.salvar = salvar;
		vm.salvarAvaliacao = salvarAvaliacao;
		vm.adicionarAvaliacao = adicionarAvaliacao;
		vm.editarAvaliacao = editarAvaliacao;
		vm.removerAvaliacao = removerAvaliacao;
		vm.getQuestoesAvaliacao = getQuestoesAvaliacao;
		
		activate();
		
		function activate() {
			if ($routeParams.id) {
				FuncionarioService.findById($routeParams.id)
				.success(function (data) {
					data.dataAdmissao = new Date(data.dataAdmissao);
					vm.funcionario = data;
				});
			}
		}
		
		function salvar() {
			FuncionarioService.save(vm.funcionario)
			.success(function () {
				$location.path('/funcionarios');
			});
		}

		function salvarAvaliacao() {
			vm.avaliacao.notasQuestoes = vm.notas;
			vm.funcionario.avaliacoes = vm.funcionario.avaliacoes || [];
			vm.funcionario.avaliacoes[avaliacaoSelecionada] = vm.avaliacao;
			avaliacaoSelecionada = -1;
			vm.avaliacao = null;
		}

		function adicionarAvaliacao() {
			vm.avaliacao = {};
			vm.questoes = [];
			vm.notas = [];
			avaliacaoSelecionada = (vm.funcionario.avaliacoes && vm.funcionario.avaliacoes.length) || 0;
		}

		function editarAvaliacao(avaliacao) {
			avaliacaoSelecionada = vm.funcionario.avaliacoes.indexOf(avaliacao);
			vm.avaliacao = angular.copy(avaliacao);
			vm.notas = angular.copy(avaliacao.notasQuestoes);
			vm.questoes = angular.copy(avaliacao.avaliacao.questoes);
		}

		function removerAvaliacao(avaliacao) {
			confirmBox('Tem certeza que deseja remover a avaliação do funcionário?', function () {
				let pos = vm.funcionario.avaliacoes.indexOf(avaliacao);
				vm.funcionario.avaliacoes.splice(pos, 1);
				$scope.$apply();
			});
		}

		function getQuestoesAvaliacao(id){
			AvaliacaoService.findById(id)
				.success(function(data) {
					vm.questoes = data.questoes;
				});
		}
	}
})();