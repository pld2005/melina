'use strict';

//Setting up route
angular.module('proveedors').config(['$stateProvider',
	function($stateProvider) {
		// Proveedors state routing
		$stateProvider.
		state('listProveedors', {
			url: '/proveedors',
			templateUrl: 'modules/proveedors/views/list-proveedors.client.view.html'
		}).
		state('createProveedor', {
			url: '/proveedors/create',
			templateUrl: 'modules/proveedors/views/create-proveedor.client.view.html'
		}).
		state('viewProveedor', {
			url: '/proveedors/:proveedorId',
			templateUrl: 'modules/proveedors/views/view-proveedor.client.view.html'
		}).
		state('editProveedor', {
			url: '/proveedors/:proveedorId/edit',
			templateUrl: 'modules/proveedors/views/edit-proveedor.client.view.html'
		});
	}
]);