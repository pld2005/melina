'use strict';

angular.module('core').directive('miCombo', [
	function() {
		return {
			template: '<input type="text" ng-model="ngModel" typeahead="itemCombo as itemCombo.name for itemCombo in getData($viewValue)" typeahead-loading="isLoading" class="form-control" typeahead-editable="false"  typeahead-min-length="3"><i ng-show="isLoading" class="glyphicon glyphicon-refresh"></i>',
			restrict: 'E',
			require: '?ngModel',
			scope: {
				miRoute: '@route',
				ngModel: '='
			},
			controller: ['$scope', '$http', function ($scope, $http) {
				var _url = $scope.miRoute;
				$scope.getData = function(val) {
					console.log(_url);
					return $http.get(_url , {
					  params: {
						f: val
					  }
					}).then(function(response){
					  return response.data;
					});
				};
			}],
		};
	}
]);