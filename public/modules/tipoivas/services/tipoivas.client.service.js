'use strict';

//Tipoivas service used to communicate Tipoivas REST endpoints
angular.module('tipoivas').factory('Tipoivas', ['$resource',
	function($resource) {
		return $resource('tipoivas/:tipoivaId', { tipoivaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);