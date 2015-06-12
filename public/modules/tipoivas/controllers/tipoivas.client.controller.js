'use strict';

// Tipoivas controller
angular.module('tipoivas').controller('TipoivasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tipoivas',
	function($scope, $stateParams, $location, Authentication, Tipoivas) {
		$scope.authentication = Authentication;

		// Create new Tipoiva
		$scope.create = function() {
			// Create new Tipoiva object
			var tipoiva = new Tipoivas ({
				name: this.name
			});

			// Redirect after save
			tipoiva.$save(function(response) {
				$location.path('tipoivas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tipoiva
		$scope.remove = function(tipoiva) {
			if ( tipoiva ) { 
				tipoiva.$remove();

				for (var i in $scope.tipoivas) {
					if ($scope.tipoivas [i] === tipoiva) {
						$scope.tipoivas.splice(i, 1);
					}
				}
			} else {
				$scope.tipoiva.$remove(function() {
					$location.path('tipoivas');
				});
			}
		};

		// Update existing Tipoiva
		$scope.update = function() {
			var tipoiva = $scope.tipoiva;

			tipoiva.$update(function() {
				$location.path('tipoivas/' + tipoiva._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tipoivas
		$scope.find = function() {
			$scope.tipoivas = Tipoivas.query();
		};

		// Find existing Tipoiva
		$scope.findOne = function() {
			$scope.tipoiva = Tipoivas.get({ 
				tipoivaId: $stateParams.tipoivaId
			});
		};
	}
]);