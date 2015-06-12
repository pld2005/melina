'use strict';

//Localidads service used to communicate Localidads REST endpoints
angular.module('localidads').factory('Localidads', ['$resource',
	function($resource) {
		return $resource('localidads/:localidadId', { localidadId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);