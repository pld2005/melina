'use strict';

//Setting up route
angular.module('provincia').config(['$stateProvider',
	function($stateProvider) {
		// Provincia state routing
		$stateProvider.
		state('listProvincia', {
			url: '/provincias',
			templateUrl: 'modules/provincia/views/list-provincia.client.view.html'
		}).
		state('createProvincium', {
			url: '/provincia/create',
			templateUrl: 'modules/provincia/views/create-provincium.client.view.html'
		}).
		state('viewProvincium', {
			url: '/provincia/:provinciumId',
			templateUrl: 'modules/provincia/views/view-provincium.client.view.html'
		}).
		state('editProvincium', {
			url: '/provincia/:provinciumId/edit',
			templateUrl: 'modules/provincia/views/edit-provincium.client.view.html'
		});
	}
]);


