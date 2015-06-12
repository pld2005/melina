'use strict';

// Tipoconceptos controller
angular.module('tipoconceptos').controller('TipoconceptosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tipoconceptos',
	function($scope, $stateParams, $location, Authentication, Tipoconceptos) {
		$scope.authentication = Authentication;

		// Create new Tipoconcepto
		$scope.create = function() {
			// Create new Tipoconcepto object
			var tipoconcepto = new Tipoconceptos ({
				name: this.name
			});

			// Redirect after save
			tipoconcepto.$save(function(response) {
				$location.path('tipoconceptos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tipoconcepto
		$scope.remove = function(tipoconcepto) {
			if ( tipoconcepto ) { 
				tipoconcepto.$remove();

				for (var i in $scope.tipoconceptos) {
					if ($scope.tipoconceptos [i] === tipoconcepto) {
						$scope.tipoconceptos.splice(i, 1);
					}
				}
			} else {
				$scope.tipoconcepto.$remove(function() {
					$location.path('tipoconceptos');
				});
			}
		};

		// Update existing Tipoconcepto
		$scope.update = function() {
			var tipoconcepto = $scope.tipoconcepto;

			tipoconcepto.$update(function() {
				$location.path('tipoconceptos/' + tipoconcepto._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tipoconceptos
		$scope.find = function() {
			$scope.tipoconceptos = Tipoconceptos.query();
		};

		// Find existing Tipoconcepto
		$scope.findOne = function() {
			$scope.tipoconcepto = Tipoconceptos.get({ 
				tipoconceptoId: $stateParams.tipoconceptoId
			});
		};
	}
]);