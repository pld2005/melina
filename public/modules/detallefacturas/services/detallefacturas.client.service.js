'use strict';

//Detallefacturas service used to communicate Detallefacturas REST endpoints
angular.module('detallefacturas').factory('Detallefacturas', ['$resource',
	function($resource) {
		return $resource('detallefacturas/:detallefacturaId', { detallefacturaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);