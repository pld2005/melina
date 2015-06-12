'use strict';

//Unidadmedidas service used to communicate Unidadmedidas REST endpoints
angular.module('unidadmedidas').factory('Unidadmedidas', ['$resource',
	function($resource) {
		return $resource('unidadmedidas/:unidadmedidaId', { unidadmedidaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);