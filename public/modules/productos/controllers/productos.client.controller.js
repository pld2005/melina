'use strict';

// Productos controller
angular.module('productos').controller('ProductosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Productos', 'DTOptionsBuilder', 'DTColumnBuilder', 'Unidadmedidas','Tipoconceptos','Tipoivas',
	function($scope, $stateParams, $location, Authentication, Productos, DTOptionsBuilder, DTColumnBuilder, Unidadmedidas, Tipoconceptos, Tipoivas) {
		$scope.authentication = Authentication;
			$scope.unidadmedidas = Unidadmedidas.query();
			$scope.tipoivas = Tipoivas.query();
			$scope.tipoconceptos = Tipoconceptos.query();

		// Create new Producto
		$scope.create = function() {
			// Create new Producto object
			var producto = new Productos ({
				name: this.name,
				tipoconcepto: this.tipoconcepto,
				precio: this.precio,
				unidadmedida: this.unidadmedida,
				tipoiva: this.tipoiva
			});

			// Redirect after save
			producto.$save(function(response) {
				$location.path('productos');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Producto
		$scope.remove = function(producto) {
			if ( producto ) { 
				producto.$remove();

				for (var i in $scope.productos) {
					if ($scope.productos [i] === producto) {
						$scope.productos.splice(i, 1);
					}
				}
			} else {
				$scope.producto.$remove(function() {
					$location.path('productos');
				});
			}
		};

		// Update existing Producto
		$scope.update = function() {
			var producto = $scope.producto;

			producto.$update(function() {
				$location.path('productos');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Productos
		$scope.find = function() {
			var vm = this;
		    vm.dtOptions = DTOptionsBuilder.newOptions()
		        //        '<row\'<col-xs-6\'l><col-xs-6\'f>r>t<row\'<col-xs-6\'i><col-xs-6\'p>>'
		        //.withDOM(('<"top">t<"bottom"<"b_left"iT><"b_center"p><"b_right"l>><"clear spacer">')
.withDOM('&lt;\'row\'&lt;\'col-xs-6\'l&gt;&lt;\'col-xs-6\'f&gt;r&gt;t&lt;\'row\'&lt;\'col-xs-6\'i&gt;&lt;\'col-xs-6\'p&gt;&gt;')
 
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
		        DTColumnBuilder.newColumn(0),
		        DTColumnBuilder.newColumn(1),
		        DTColumnBuilder.newColumn(2),
		        DTColumnBuilder.newColumn(3),
		        DTColumnBuilder.newColumn(4).notSortable()
		    ];

			Productos.query().$promise.then(function(productos) {
		        $scope.productos = productos;
		    });
		};

		// Find existing Producto
		$scope.findOne = function() {
			$scope.producto = Productos.get({ 
				productoId: $stateParams.productoId
			});
		};
	}
]);