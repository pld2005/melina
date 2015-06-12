'use strict';

//Setting up route
angular.module('facturas').config(['$stateProvider',
	function($stateProvider) {
		// Facturas state routing
		$stateProvider.
		state('listFacturas', {
			url: '/facturas',
			templateUrl: 'modules/facturas/views/list-facturas.client.view.html'
		}).
		state('createFactura', {
			url: '/facturas/create',
			templateUrl: 'modules/facturas/views/create-factura.client.view.html'
		}).
		state('viewFactura', {
			url: '/facturas/:facturaId',
			templateUrl: 'modules/facturas/views/view-factura.client.view.html'
		}).
		state('editFactura', {
			url: '/facturas/:facturaId/edit',
			templateUrl: 'modules/facturas/views/edit-factura.client.view.html'
		});
	}
]);