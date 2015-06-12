'use strict';

// Provincia controller
angular.module('provincia').controller('ProvinciaController', ['$scope', '$stateParams', '$location', 'Authentication', 'Provincia',
	function($scope, $stateParams, $location, Authentication, Provincia) {
		$scope.authentication = Authentication;

		// Create new Provincium
		$scope.create = function() {
			// Create new Provincium object
			var provincium = new Provincia ({
				name: this.name
			});

			// Redirect after save
			provincium.$save(function(response) {
				$location.path('provincia/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Provincium
		$scope.remove = function(provincium) {
			if ( provincium ) { 
				provincium.$remove();

				for (var i in $scope.provincia) {
					if ($scope.provincia [i] === provincium) {
						$scope.provincia.splice(i, 1);
					}
				}
			} else {
				$scope.provincium.$remove(function() {
					$location.path('provincia');
				});
			}
		};

		// Update existing Provincium
		$scope.update = function() {
			var provincium = $scope.provincium;

			provincium.$update(function() {
				$location.path('provincia/' + provincium._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Provincia
		$scope.find = function() {
			$scope.provincia = Provincia.query();
		};

		// Find existing Provincium
		$scope.findOne = function() {
			$scope.provincium = Provincia.get({ 
				provinciumId: $stateParams.provinciumId
			});
		};
	}
]);