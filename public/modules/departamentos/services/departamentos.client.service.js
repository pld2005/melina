'use strict';

//Departamentos service used to communicate Departamentos REST endpoints
angular.module('departamentos').factory('Departamentos', ['$resource',
	function($resource) {
		return $resource('departamentos/:departamentoId', { departamentoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('departamentos').factory('DepartamentByProvincia', ['$resource',
    function($resource) {
    	return $resource('departamentos/provincia/:provincia', { provinciaId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
