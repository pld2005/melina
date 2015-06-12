'use strict';

//Proveedors service used to communicate Proveedors REST endpoints
angular.module('proveedors').factory('Proveedors', ['$resource',
	function($resource) {
		return $resource('proveedors/:proveedorId', { proveedorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);