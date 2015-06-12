'use strict';

//Setting up route
angular.module('departamentos').config(['$stateProvider',
	function($stateProvider) {
		// Departamentos state routing
		$stateProvider.
		state('listDepartamentos', {
			url: '/departamentos',
			templateUrl: 'modules/departamentos/views/list-departamentos.client.view.html'
		}).
		state('createDepartamento', {
			url: '/departamentos/create',
			templateUrl: 'modules/departamentos/views/create-departamento.client.view.html'
		}).
		state('viewDepartamento', {
			url: '/departamentos/:departamentoId',
			templateUrl: 'modules/departamentos/views/view-departamento.client.view.html'
		}).
		state('editDepartamento', {
			url: '/departamentos/:departamentoId/edit',
			templateUrl: 'modules/departamentos/views/edit-departamento.client.view.html'
		});
	}
]);