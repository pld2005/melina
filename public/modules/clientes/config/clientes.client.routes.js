'use strict';

//Setting up route
angular.module('clientes').config(['$stateProvider', '$urlRouterProvider', 
	function($stateProvider) {
		// Clientes state routing
		$stateProvider.
		state('listClientes', {
			url: '/clientes',
			data: {pageTitle: 'Clientes', pageSubTitle: 'Listado de clientes.'},
			templateUrl: 'modules/clientes/views/list-clientes.client.view.html',
		}).
		state('createCliente', {
			url: '/clientes/create',
			data: {pageTitle: 'Clientes', pageSubTitle: 'Complete el formulario para crear un cliente.'},
			templateUrl: 'modules/clientes/views/create-cliente.client.view.html',
		}).
		state('viewCliente', {
			url: '/clientes/:clienteId',
			templateUrl: 'modules/clientes/views/view-cliente.client.view.html'
		}).
		state('editCliente', {
			url: '/clientes/:clienteId/edit',
			data: {pageTitle: 'Clientes', pageSubTitle: 'Edición de datos del cliente.'},
			templateUrl: 'modules/clientes/views/edit-cliente.client.view.html'
		});
	}
]);