'use strict';

//Provincia service used to communicate Provincia REST endpoints
angular.module('provincia').factory('Provincia', ['$resource',
	function($resource) {
		return $resource('provincia/:provinciumId', { provinciumId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);