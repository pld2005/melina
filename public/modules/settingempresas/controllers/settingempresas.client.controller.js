'use strict';

// Settingempresas controller
angular.module('settingempresas').controller('SettingempresasController', ['$scope', '$element', '$stateParams', '$location', 'Authentication', 
	'Condicionivas', 'Provincia', 'Departamentos',  'DepartamentByProvincia', 'Settingempresas',
	function($scope, $element, $stateParams, $location, Authentication, Condicionivas,
		Provincia, Departamentos, DepartamentByProvincia, Settingempresas) {
		$scope.authentication = Authentication;
$("[name='facturaProductos']").bootstrapSwitch();
		// Create new Settingempresa
		$scope.create = function() {
			// Create new Settingempresa object
			var settingempresa = new Settingempresas ({

				name: this.name,
				cuit:  $('#cuit').val(),
				condicioniva: this.condicioniva,
				puntoventa: this.puntoventa,
				iibb: this.iibb,
				inicioactividades: this.inicioactividades,
				telefono: this.telefono,
				domicilio: this.domicilio,
				localidad: $( '#localidad option:selected' ).text(),
				provincia: $( '#provincia option:selected' ).text(),
				nroFacturaA: this.nroFacturaA,
				nroFacturaB: this.nroFacturaB,
				nroFacturaC: this.nroFacturaC,
				nroNDA: this.nroNDA,
				nroNDB: this.nroNDB,
				nroNDC: this.nroNDC,
				nroNCA: this.nroNCA,
				nroNCB: this.nroNCB,
				nroNCC: this.nroNCC,
				nroRecibo: this.nroRecibo,
				facturaProductos: this.facturaProductos
			});

			// Redirect after save
			settingempresa.$save(function(response) {
				$location.path('settingempresas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Settingempresa
		$scope.remove = function(settingempresa) {
			if ( settingempresa ) { 
				settingempresa.$remove();

				for (var i in $scope.settingempresas) {
					if ($scope.settingempresas [i] === settingempresa) {
						$scope.settingempresas.splice(i, 1);
					}
				}
			} else {
				$scope.settingempresa.$remove(function() {
					$location.path('settingempresas');
				});
			}
		};

		// Update existing Settingempresa
		$scope.update = function() {
			debugger
			var settingempresa = $scope.settingempresa;

			settingempresa.$update(function() {
				$location.path('settingempresas/' + settingempresa._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Settingempresas
		$scope.find = function() {
			$scope.settingempresas = Settingempresas.query();
		};

		// Find existing Settingempresa
		$scope.findOne = function() {
			$scope.settingempresa = Settingempresas.get({ 
				settingempresaId: $stateParams.settingempresaId
			});
			$('#cuit').inputmask('99-99999999-9');
			$scope.condicionivas = Condicionivas.query();
			$scope.provincias = Provincia.query();
			$scope.departamentos = Departamentos.query();

			$scope.$watch('provincia', function(newVal) {
		        if (newVal) {

					$scope.departamentos = DepartamentByProvincia.query({
	        			provincia: newVal
	    			}, function (){
						$scope.departamentos
	    			});
		   	 	}
			});
		};

		$scope.mostrarRI = function(){
			if (!angular.isUndefined(this.condicioniva)){
				var ivaactual = this.condicioniva;
				var mostrar;
				$scope.condicionivas.forEach(function(item) {
					if (item._id === ivaactual) {
						if (item.idafip === 1) {
							mostrar = true;
						}else{
							mostrar = false;
						}
						return false;
					}
				});
				return mostrar;
			}
		};

		$scope.mostrarRIedit = function(){
			if (!angular.isUndefined(this.settingempresa.condicioniva)){
				var ivaactual = this.settingempresa.condicioniva;
				var mostrar;
				$scope.condicionivas.forEach(function(item) {
					if (item._id === ivaactual) {
						if (item.idafip === 1) {
							mostrar = true;
						}else{
							mostrar = false;
						}
						return false;
					}
				});
				return mostrar;
			}
		};

		$scope.initmask = function() {
			Settingempresas.query().$promise.then(function(data) {  
				//verificar si ya ha creado la configuracion
				if (data.length > 0){
					$location.path('settingempresas/' + data[0]._id + '/edit');
				}else{

					$('#cuit').inputmask('99-99999999-9');
					$scope.condicionivas = Condicionivas.query();
					$scope.provincias = Provincia.query();
					$scope.departamentos = Departamentos.query();

					$scope.$watch('provincia', function(newVal) {
				        if (newVal) {

							$scope.departamentos = DepartamentByProvincia.query({
			        			provincia: newVal
			    			}, function (){
								$scope.departamentos
			    			});
				   	 	}
					});
				}
			});
		};
	}
]);