'use strict';

//Tipoconceptos service used to communicate Tipoconceptos REST endpoints
angular.module('tipoconceptos').factory('Tipoconceptos', ['$resource',
	function($resource) {
		return $resource('tipoconceptos/:tipoconceptoId', { tipoconceptoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);