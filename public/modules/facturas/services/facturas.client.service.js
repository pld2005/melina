'use strict';

//Facturas service used to communicate Facturas REST endpoints
angular.module('facturas').factory('Facturas', ['$resource',
	function($resource) {
		return $resource('facturas/:facturaId', { facturaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('facturas').factory('getNroFacturaService', ['$resource',
    function($resource) {
        return $resource('nrofactura/:tipofactura', {
            tipofactura: '',
        });
    }
]);
