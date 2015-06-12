'use strict';

// Localidads controller
angular.module('localidads').controller('LocalidadsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Localidads',
	function($scope, $stateParams, $location, Authentication, Localidads) {
		$scope.authentication = Authentication;

		// Create new Localidad
		$scope.create = function() {
			// Create new Localidad object
			var localidad = new Localidads ({
				name: this.name
			});

			// Redirect after save
			localidad.$save(function(response) {
				$location.path('localidads/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Localidad
		$scope.remove = function(localidad) {
			if ( localidad ) { 
				localidad.$remove();

				for (var i in $scope.localidads) {
					if ($scope.localidads [i] === localidad) {
						$scope.localidads.splice(i, 1);
					}
				}
			} else {
				$scope.localidad.$remove(function() {
					$location.path('localidads');
				});
			}
		};

		// Update existing Localidad
		$scope.update = function() {
			var localidad = $scope.localidad;

			localidad.$update(function() {
				$location.path('localidads/' + localidad._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Localidads
		$scope.find = function() {
			$scope.localidads = Localidads.query();
		};

		// Find existing Localidad
		$scope.findOne = function() {
			$scope.localidad = Localidads.get({ 
				localidadId: $stateParams.localidadId
			});
		};
	}
]);