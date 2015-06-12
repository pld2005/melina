'use strict';

// Proveedors controller
angular.module('proveedors').controller('ProveedorsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Proveedors',
	function($scope, $stateParams, $location, Authentication, Proveedors) {
		$scope.authentication = Authentication;

		// Create new Proveedor
		$scope.create = function() {
			// Create new Proveedor object
			var proveedor = new Proveedors ({
				name: this.name
			});

			// Redirect after save
			proveedor.$save(function(response) {
				$location.path('proveedors/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Proveedor
		$scope.remove = function(proveedor) {
			if ( proveedor ) { 
				proveedor.$remove();

				for (var i in $scope.proveedors) {
					if ($scope.proveedors [i] === proveedor) {
						$scope.proveedors.splice(i, 1);
					}
				}
			} else {
				$scope.proveedor.$remove(function() {
					$location.path('proveedors');
				});
			}
		};

		// Update existing Proveedor
		$scope.update = function() {
			var proveedor = $scope.proveedor;

			proveedor.$update(function() {
				$location.path('proveedors/' + proveedor._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Proveedors
		$scope.find = function() {
			$scope.proveedors = Proveedors.query();
		};

		// Find existing Proveedor
		$scope.findOne = function() {
			$scope.proveedor = Proveedors.get({ 
				proveedorId: $stateParams.proveedorId
			});
		};
	}
]);