'use strict';

//Tipocomprobantes service used to communicate Tipocomprobantes REST endpoints
angular.module('tipocomprobantes').factory('Tipocomprobantes', ['$resource',
	function($resource) {
		return $resource('tipocomprobantes/:tipocomprobanteId', { tipocomprobanteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);