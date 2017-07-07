(function () {
	'use strict';

	angular
		.module('app')
		.controller('AvaliacaoListController', AvaliacaoListController);

	AvaliacaoListController.$inject = ['AvaliacaoService'];
	function AvaliacaoListController(AvaliacaoService) {
		var vm = this;
		vm.avaliacoes = [];
		vm.remover = remover;
				
		activate();

		function activate() {
			AvaliacaoService.find()
				.success(function (data) {
					vm.avaliacoes = data;
				});
		}

		function remover(avaliacao) {
			confirmBox('Deseja realmente remover a avaliação "' + avaliacao.tipo + '"', function () {
				AvaliacaoService.remove(avaliacao._id)
					.success(function () {
						activate();
					});
			});

		}

	}
})();