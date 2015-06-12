'use strict';

//Setting up route
angular.module('detallefacturas').config(['$stateProvider',
	function($stateProvider) {
		// Detallefacturas state routing
		$stateProvider.
		state('listDetallefacturas', {
			url: '/detallefacturas',
			templateUrl: 'modules/detallefacturas/views/list-detallefacturas.client.view.html'
		}).
		state('createDetallefactura', {
			url: '/detallefacturas/create',
			templateUrl: 'modules/detallefacturas/views/create-detallefactura.client.view.html'
		}).
		state('viewDetallefactura', {
			url: '/detallefacturas/:detallefacturaId',
			templateUrl: 'modules/detallefacturas/views/view-detallefactura.client.view.html'
		}).
		state('editDetallefactura', {
			url: '/detallefacturas/:detallefacturaId/edit',
			templateUrl: 'modules/detallefacturas/views/edit-detallefactura.client.view.html'
		});
	}
]);