'use strict';

//Setting up route
angular.module('condicionivas').config(['$stateProvider',
	function($stateProvider) {
		// Condicionivas state routing
		$stateProvider.
		state('listCondicionivas', {
			url: '/condicionivas',
			templateUrl: 'modules/condicionivas/views/list-condicionivas.client.view.html'
		}).
		state('createCondicioniva', {
			url: '/condicionivas/create',
			templateUrl: 'modules/condicionivas/views/create-condicioniva.client.view.html'
		}).
		state('viewCondicioniva', {
			url: '/condicionivas/:condicionivaId',
			templateUrl: 'modules/condicionivas/views/view-condicioniva.client.view.html'
		}).
		state('editCondicioniva', {
			url: '/condicionivas/:condicionivaId/edit',
			templateUrl: 'modules/condicionivas/views/edit-condicioniva.client.view.html'
		});
	}
]);