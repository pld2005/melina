'use strict';
// Clientes controller
angular.module('clientes').controller('ClientesController', ['$scope',
 '$stateParams',  '$location',   'Authentication',  'Clientes', 'Condicionivas',
 'Provincia', 'Departamentos',  'DepartamentByProvincia', 'DTOptionsBuilder', 'DTColumnBuilder',
function($scope, $stateParams, $location, 
		Authentication, Clientes, Condicionivas,
		Provincia, Departamentos, DepartamentByProvincia,
		DTOptionsBuilder, DTColumnBuilder) {
		$scope.authentication = Authentication;

		$(document).keydown(function(e) {
		    var nodeName = e.target.nodeName.toLowerCase();

		    if (e.which === 8 && nodeName === 'select') {
		            e.preventDefault();
		        }
		});

		// Create new Cliente
		$scope.create = function() {
			// Create new Cliente object
			var cliente = new Clientes ({
				name: this.name,
				cuit: $('#cuit').val(),
				condicioniva: this.condicioniva,
				telefono: this.telefono,
				email: this.email,
				domicilio: this.domicilio,
				localidad: $( '#localidad option:selected' ).text(),
				provincia: $( '#provincia option:selected' ).text(),
				cuentacontable: this.cuentacontable
			});

			// Redirect after save
			cliente.$save(function(response) {
				$location.path('clientes');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Cliente
		$scope.remove = function(cliente) {
			if ( cliente ) { 
				cliente.$remove();

				for (var i in $scope.clientes) {
					if ($scope.clientes [i] === cliente) {
						$scope.clientes.splice(i, 1);
					}
				}
			} else {
				$scope.cliente.$remove(function() {
					$location.path('clientes');
				});
			}
		};

		// Update existing Cliente
		$scope.update = function() {
			var cliente = $scope.cliente;

			cliente.$update(function() {
				$location.path('clientes');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Clientes
		$scope.find = function() {
			var vm = this;
		    vm.dtOptions = DTOptionsBuilder.newOptions()
		        //        '<row\'<col-xs-6\'l><col-xs-6\'f>r>t<row\'<col-xs-6\'i><col-xs-6\'p>>'
		        //.withDOM(('<"top">t<"bottom"<"b_left"iT><"b_center"p><"b_right"l>><"clear spacer">')
        //.withDOM('&lt;\'row\'&lt;\'col-xs-6\'l&gt;&lt;\'col-xs-6\'f&gt;r&gt;t&lt;\'row\'&lt;\'col-xs-6\'i&gt;&lt;\'col-xs-6\'p&gt;&gt;')
 
		        // Add Bootstrap compatibility
		        .withLanguage({
				   	'sProcessing':     'Procesando...',
				    'sLengthMenu':     'Mostrar _MENU_ registros',
				    'sZeroRecords':    'No se encontraron resultados',
				    'sEmptyTable':     'Ningún dato disponible en esta tabla',
				    'sInfo':           'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
				    'sInfoEmpty':      'Mostrando registros del 0 al 0 de un total de 0 registros',
				    'sInfoFiltered':   '(filtrado de un total de _MAX_ registros)',
				    'sInfoPostFix':    '',
				    'sSearch':         'Buscar:',
				    'sUrl':            '',
				    'sInfoThousands':  '.',
				    'sLoadingRecords': 'Cargando...',
				    'oPaginate': {
				        'sFirst':    'Primero',
				        'sLast':     'Último',
				        'sNext':     'Siguiente',
				        'sPrevious': 'Anterior'
				    },
				    'oAria': {
				        'sSortAscending':  ': Activar para ordenar la columna de manera ascendente',
				        'sSortDescending': ': Activar para ordenar la columna de manera descendente'
				    }
				})
		        .withBootstrap()
		        .withBootstrapOptions({
		            TableTools: {
		                classes: {
		                    container: 'btn_exportar',
		                    buttons: {
		                        normal: 'btn btn-info'
		                    }
		                }
		            },
		            ColVis: {
		                classes: {
		                    masterButton: 'btn btn-primary'
		                }
		            },
		            pagination: {
		                classes: {
		                    ul: 'pagination pagination-sm'
		                }
		            }
		        })
		        // Add ColVis compatibility
		        .withColVis()
				// Add Table tools compatibility
		        .withTableTools('assets/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf')
		        .withTableToolsButtons([
		             {
		                'sExtends': 'collection',
		                'sButtonText': 'Exportar',
		                'aButtons': [{
			                    'sExtends': 'copy',
			                    'sButtonText': 'Copiar'
			                },
			                {
			                    'sExtends': 'csv',
			                    'sButtonText': 'Excel'
			                },
			                {
			                    'sExtends': 'print',
			                    'sInfo': 'Presione la tecla ESC para volver.',
			                    'sButtonText': 'Imprimir'
			                }]
		            }
		        ]);
		    vm.dtColumns = [
		        DTColumnBuilder.newColumn('name').withTitle('Nombre'),
		        DTColumnBuilder.newColumn('cuit').withTitle('CUIT'),
		        DTColumnBuilder.newColumn('domicilio').withTitle('Domicilio'),
		        DTColumnBuilder.newColumn(3).notSortable()
		    ];



			Clientes.query().$promise.then(function(clientes) {
		        $scope.clientes = clientes;
		    });

		};



		$scope.confirmRemove = function(cliente) {
			bootbox.dialog({
                    message: 'Está seguro que desea eliminar el registro?',
                    title: 'Confirmar acción',
                    buttons: {
                      danger: {
                        label: 'Eliminar',
                        className: 'red',
                        callback: function() {
                          $scope.remove(cliente);
                        }
                      },
                      main: {
                        label: 'Cancelar',
                        className: 'blue',
                        callback: function() {
                          //alert('Primary button');
                        }
                      }
                    }
                });
		};
		// Find existing Cliente
		$scope.findOne = function() {
			$scope.condicionivas = Condicionivas.query();
			$scope.provincias = Provincia.query();
			$scope.departamentos = Departamentos.query();
			$scope.cliente = Clientes.get({ 
				clienteId: $stateParams.clienteId
			});

			$('#cuit').inputmask('99-99999999-9');

			$scope.$watch('cliente.provincia', function(newVal) {
		        if (newVal) {

					$scope.departamentos = DepartamentByProvincia.query({
	        			provincia: newVal
	    			}, function (){
						$scope.departamentos;
	    			});
		   	 	}
			});
		};

		$scope.initmask = function() {
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
	}
]);

