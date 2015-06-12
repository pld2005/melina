'use strict';

//Setting up route
angular.module('settingempresas').config(['$stateProvider',
	function($stateProvider) {
		// Settingempresas state routing
		$stateProvider.
		/*state('listSettingempresas', {
			url: '/settingempresas',
			templateUrl: 'modules/settingempresas/views/list-settingempresas.client.view.html'
		}).*/
		state('createSettingempresa', {
			url: '/settingempresas/create',
			templateUrl: 'modules/settingempresas/views/create-settingempresa.client.view.html'
		}).
		/*state('viewSettingempresa', {
			url: '/settingempresas/:settingempresaId',
			templateUrl: 'modules/settingempresas/views/view-settingempresa.client.view.html'
		}).*/
		state('editSettingempresa', {
			url: '/settingempresas/:settingempresaId/edit',
			templateUrl: 'modules/settingempresas/views/edit-settingempresa.client.view.html'
		});
	}
]);