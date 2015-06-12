'use strict';

//Setting up route
angular.module('tipoconceptos').config(['$stateProvider',
	function($stateProvider) {
		// Tipoconceptos state routing
		$stateProvider.
		state('listTipoconceptos', {
			url: '/tipoconceptos',
			templateUrl: 'modules/tipoconceptos/views/list-tipoconceptos.client.view.html'
		}).
		state('createTipoconcepto', {
			url: '/tipoconceptos/create',
			templateUrl: 'modules/tipoconceptos/views/create-tipoconcepto.client.view.html'
		}).
		state('viewTipoconcepto', {
			url: '/tipoconceptos/:tipoconceptoId',
			templateUrl: 'modules/tipoconceptos/views/view-tipoconcepto.client.view.html'
		}).
		state('editTipoconcepto', {
			url: '/tipoconceptos/:tipoconceptoId/edit',
			templateUrl: 'modules/tipoconceptos/views/edit-tipoconcepto.client.view.html'
		});
	}
]);