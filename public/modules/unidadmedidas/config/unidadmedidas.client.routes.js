'use strict';

//Setting up route
angular.module('unidadmedidas').config(['$stateProvider',
	function($stateProvider) {
		// Unidadmedidas state routing
		$stateProvider.
		state('listUnidadmedidas', {
			url: '/unidadmedidas',
			templateUrl: 'modules/unidadmedidas/views/list-unidadmedidas.client.view.html'
		}).
		state('createUnidadmedida', {
			url: '/unidadmedidas/create',
			templateUrl: 'modules/unidadmedidas/views/create-unidadmedida.client.view.html'
		}).
		state('viewUnidadmedida', {
			url: '/unidadmedidas/:unidadmedidaId',
			templateUrl: 'modules/unidadmedidas/views/view-unidadmedida.client.view.html'
		}).
		state('editUnidadmedida', {
			url: '/unidadmedidas/:unidadmedidaId/edit',
			templateUrl: 'modules/unidadmedidas/views/edit-unidadmedida.client.view.html'
		});
	}
]);