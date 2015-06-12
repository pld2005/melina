'use strict';

//Settingempresas service used to communicate Settingempresas REST endpoints
angular.module('settingempresas').factory('Settingempresas', ['$resource',
	function($resource) {
		return $resource('settingempresas/:settingempresaId', { settingempresaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);