'use strict';

// Tipocomprobantes controller
angular.module('tipocomprobantes').controller('TipocomprobantesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tipocomprobantes',
	function($scope, $stateParams, $location, Authentication, Tipocomprobantes) {
		$scope.authentication = Authentication;

		// Create new Tipocomprobante
		$scope.create = function() {
			// Create new Tipocomprobante object
			var tipocomprobante = new Tipocomprobantes ({
				name: this.name
			});

			// Redirect after save
			tipocomprobante.$save(function(response) {
				$location.path('tipocomprobantes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tipocomprobante
		$scope.remove = function(tipocomprobante) {
			if ( tipocomprobante ) { 
				tipocomprobante.$remove();

				for (var i in $scope.tipocomprobantes) {
					if ($scope.tipocomprobantes [i] === tipocomprobante) {
						$scope.tipocomprobantes.splice(i, 1);
					}
				}
			} else {
				$scope.tipocomprobante.$remove(function() {
					$location.path('tipocomprobantes');
				});
			}
		};

		// Update existing Tipocomprobante
		$scope.update = function() {
			var tipocomprobante = $scope.tipocomprobante;

			tipocomprobante.$update(function() {
				$location.path('tipocomprobantes/' + tipocomprobante._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tipocomprobantes
		$scope.find = function() {
			$scope.tipocomprobantes = Tipocomprobantes.query();
		};

		// Find existing Tipocomprobante
		$scope.findOne = function() {
			$scope.tipocomprobante = Tipocomprobantes.get({ 
				tipocomprobanteId: $stateParams.tipocomprobanteId
			});
		};
	}
]);