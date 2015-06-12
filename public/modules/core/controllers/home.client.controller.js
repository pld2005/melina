'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;


	}
]);



angular.module('core').filter('formatCuit', function() {
    return function (number) {
    	if (!isNaN(number)) {
    		var formattedNumber = number.replace(/(\d{2})(\d{8})(\d{1})/, "$1-$2-$3");
			return formattedNumber;
    	}
	    
    };
});