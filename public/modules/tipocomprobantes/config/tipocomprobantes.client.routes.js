'use strict';

//Setting up route
angular.module('tipocomprobantes').config(['$stateProvider',
	function($stateProvider) {
		// Tipocomprobantes state routing
		$stateProvider.
		state('listTipocomprobantes', {
			url: '/tipocomprobantes',
			templateUrl: 'modules/tipocomprobantes/views/list-tipocomprobantes.client.view.html'
		}).
		state('createTipocomprobante', {
			url: '/tipocomprobantes/create',
			templateUrl: 'modules/tipocomprobantes/views/create-tipocomprobante.client.view.html'
		}).
		state('viewTipocomprobante', {
			url: '/tipocomprobantes/:tipocomprobanteId',
			templateUrl: 'modules/tipocomprobantes/views/view-tipocomprobante.client.view.html'
		}).
		state('editTipocomprobante', {
			url: '/tipocomprobantes/:tipocomprobanteId/edit',
			templateUrl: 'modules/tipocomprobantes/views/edit-tipocomprobante.client.view.html'
		});
	}
]);