'use strict';

// Departamentos controller
angular.module('departamentos').controller('DepartamentosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Departamentos',
	function($scope, $stateParams, $location, Authentication, Departamentos) {
		$scope.authentication = Authentication;

		// Create new Departamento
		$scope.create = function() {
			// Create new Departamento object
			var departamento = new Departamentos ({
				name: this.name
			});

			// Redirect after save
			departamento.$save(function(response) {
				$location.path('departamentos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Departamento
		$scope.remove = function(departamento) {
			if ( departamento ) { 
				departamento.$remove();

				for (var i in $scope.departamentos) {
					if ($scope.departamentos [i] === departamento) {
						$scope.departamentos.splice(i, 1);
					}
				}
			} else {
				$scope.departamento.$remove(function() {
					$location.path('departamentos');
				});
			}
		};

		// Update existing Departamento
		$scope.update = function() {
			var departamento = $scope.departamento;

			departamento.$update(function() {
				$location.path('departamentos/' + departamento._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Departamentos
		$scope.find = function() {
			$scope.departamentos = Departamentos.query();
		};

		// Find existing Departamento
		$scope.findOne = function() {
			$scope.departamento = Departamentos.get({ 
				departamentoId: $stateParams.departamentoId
			});
		};
	}
]);