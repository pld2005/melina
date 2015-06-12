'use strict';

//Setting up route
angular.module('localidads').config(['$stateProvider',
	function($stateProvider) {
		// Localidads state routing
		$stateProvider.
		state('listLocalidads', {
			url: '/localidades',
			templateUrl: 'modules/localidads/views/list-localidads.client.view.html'
		}).
		state('createLocalidad', {
			url: '/localidads/create',
			templateUrl: 'modules/localidads/views/create-localidad.client.view.html'
		}).
		state('viewLocalidad', {
			url: '/localidads/:localidadId',
			templateUrl: 'modules/localidads/views/view-localidad.client.view.html'
		}).
		state('editLocalidad', {
			url: '/localidads/:localidadId/edit',
			templateUrl: 'modules/localidads/views/edit-localidad.client.view.html'
		});
	}
]);