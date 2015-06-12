'use strict';

//Setting up route
angular.module('tipoivas').config(['$stateProvider',
	function($stateProvider) {
		// Tipoivas state routing
		$stateProvider.
		state('listTipoivas', {
			url: '/tipoivas',
			templateUrl: 'modules/tipoivas/views/list-tipoivas.client.view.html'
		}).
		state('createTipoiva', {
			url: '/tipoivas/create',
			templateUrl: 'modules/tipoivas/views/create-tipoiva.client.view.html'
		}).
		state('viewTipoiva', {
			url: '/tipoivas/:tipoivaId',
			templateUrl: 'modules/tipoivas/views/view-tipoiva.client.view.html'
		}).
		state('editTipoiva', {
			url: '/tipoivas/:tipoivaId/edit',
			templateUrl: 'modules/tipoivas/views/edit-tipoiva.client.view.html'
		});
	}
]);