'use strict';

// Unidadmedidas controller
angular.module('unidadmedidas').controller('UnidadmedidasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Unidadmedidas',
	function($scope, $stateParams, $location, Authentication, Unidadmedidas) {
		$scope.authentication = Authentication;

		// Create new Unidadmedida
		$scope.create = function() {
			// Create new Unidadmedida object
			var unidadmedida = new Unidadmedidas ({
				name: this.name
			});

			// Redirect after save
			unidadmedida.$save(function(response) {
				$location.path('unidadmedidas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Unidadmedida
		$scope.remove = function(unidadmedida) {
			if ( unidadmedida ) { 
				unidadmedida.$remove();

				for (var i in $scope.unidadmedidas) {
					if ($scope.unidadmedidas [i] === unidadmedida) {
						$scope.unidadmedidas.splice(i, 1);
					}
				}
			} else {
				$scope.unidadmedida.$remove(function() {
					$location.path('unidadmedidas');
				});
			}
		};

		// Update existing Unidadmedida
		$scope.update = function() {
			var unidadmedida = $scope.unidadmedida;

			unidadmedida.$update(function() {
				$location.path('unidadmedidas/' + unidadmedida._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Unidadmedidas
		$scope.find = function() {
			$scope.unidadmedidas = Unidadmedidas.query();
		};

		// Find existing Unidadmedida
		$scope.findOne = function() {
			$scope.unidadmedida = Unidadmedidas.get({ 
				unidadmedidaId: $stateParams.unidadmedidaId
			});
		};
	}
]);