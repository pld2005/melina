'use strict';

//Condicionivas service used to communicate Condicionivas REST endpoints
angular.module('condicionivas').factory('Condicionivas', ['$resource',
	function($resource) {
		return $resource('condicionivas/:condicionivaId', { condicionivaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);