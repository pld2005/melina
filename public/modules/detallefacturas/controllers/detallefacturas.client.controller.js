'use strict';

// Detallefacturas controller
angular.module('detallefacturas').controller('DetallefacturasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Detallefacturas',
	function($scope, $stateParams, $location, Authentication, Detallefacturas) {
		$scope.authentication = Authentication;

		// Create new Detallefactura
		$scope.create = function() {
			// Create new Detallefactura object
			var detallefactura = new Detallefacturas ({
				name: this.name
			});

			// Redirect after save
			detallefactura.$save(function(response) {
				$location.path('detallefacturas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Detallefactura
		$scope.remove = function(detallefactura) {
			if ( detallefactura ) { 
				detallefactura.$remove();

				for (var i in $scope.detallefacturas) {
					if ($scope.detallefacturas [i] === detallefactura) {
						$scope.detallefacturas.splice(i, 1);
					}
				}
			} else {
				$scope.detallefactura.$remove(function() {
					$location.path('detallefacturas');
				});
			}
		};

		// Update existing Detallefactura
		$scope.update = function() {
			var detallefactura = $scope.detallefactura;

			detallefactura.$update(function() {
				$location.path('detallefacturas/' + detallefactura._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Detallefacturas
		$scope.find = function() {
			$scope.detallefacturas = Detallefacturas.query();
		};

		// Find existing Detallefactura
		$scope.findOne = function() {
			$scope.detallefactura = Detallefacturas.get({ 
				detallefacturaId: $stateParams.detallefacturaId
			});
		};
	}
]);