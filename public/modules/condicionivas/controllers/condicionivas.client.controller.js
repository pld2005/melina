'use strict';

// Condicionivas controller
angular.module('condicionivas').controller('CondicionivasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Condicionivas',
	function($scope, $stateParams, $location, Authentication, Condicionivas) {
		$scope.authentication = Authentication;

		// Create new Condicioniva
		$scope.create = function() {
			// Create new Condicioniva object
			var condicioniva = new Condicionivas ({
				name: this.name
			});

			// Redirect after save
			condicioniva.$save(function(response) {
				$location.path('condicionivas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Condicioniva
		$scope.remove = function(condicioniva) {
			if ( condicioniva ) { 
				condicioniva.$remove();

				for (var i in $scope.condicionivas) {
					if ($scope.condicionivas [i] === condicioniva) {
						$scope.condicionivas.splice(i, 1);
					}
				}
			} else {
				$scope.condicioniva.$remove(function() {
					$location.path('condicionivas');
				});
			}
		};

		// Update existing Condicioniva
		$scope.update = function() {
			var condicioniva = $scope.condicioniva;

			condicioniva.$update(function() {
				$location.path('condicionivas/' + condicioniva._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Condicionivas
		$scope.find = function() {
			$scope.condicionivas = Condicionivas.query();
		};

		// Find existing Condicioniva
		$scope.findOne = function() {
			$scope.condicioniva = Condicionivas.get({ 
				condicionivaId: $stateParams.condicionivaId
			});
		};
	}
]);