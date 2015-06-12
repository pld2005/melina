'use strict';


// Facturas controller
angular.module('facturas').controller('FacturasController', ['$scope', '$stateParams', '$location', '$http', '$filter', 'Authentication', 'Facturas', 'getNroFacturaService', 'Tipocomprobantes', 'Tipoivas', 'Clientes',
	function($scope, $stateParams, $location, $http, $filter, Authentication, Facturas, getNroFacturaService, Tipocomprobantes, Tipoivas, Clientes) {
		
/*$scope.getComboClientes = function(val) {
    return $http.get('/combocliente', {
      params: {
        f: val
      }
    }).then(function(response){
      return response.data;
    });
};*/

$scope.verificar = function(){
	console.log($scope.asyncSelected);

}
		$scope.authentication = Authentication;
		

		$scope.TipoFactura = '';
		$scope.person = {};
		$scope.producto = {};
		$scope.detalle = [];
		var item = {
						cantidad: 1,
						descuento: 0,
						producto: {},
						descripcion: '',
						precio: 0,
						tipoiva: {},
						valoriva: 0,
						subtotal: 0
					};

		$scope.detalle.push(item);
		$scope.tipocomprobantes = Tipocomprobantes.query();
		$scope.tipoivas = Tipoivas.query();
		$scope.TipoIVASelecionado;
		$scope.facturarproductos = $scope.authentication.user.settingempresa.facturaProductos;
		$scope.numero = 0;
		$scope.tipo_cbte = 0;
		$scope.neto1 = 0;
		$scope.netoNoGravado = 0;
		$scope.exento = 0;
		$scope.total = 0;
		$scope.iva21 = 0;
		$scope.iva105 = 0;

		

		$scope.AgregarItem = function() {
			var item = {
						cantidad: 1,
						descuento: 0,
						producto: {},
						descripcion: '',
						precio: 0,
						tipoiva: 1,
						valoriva: 0,
						subtotal: 0
					};
			$scope.detalle.push(item);
		};

		$scope.BorrarItem = function(index) {
 			$scope.detalle.splice(index, 1);
 			$scope.CalcularTotales();
		};

		$scope.SeleccionarIvaSegunProducto = function(item){
			$.each($scope.detalle, function(i){
			    //si es un producto, cargar precio y seleccionar iva
			    if($scope.detalle[i].$$hashKey === item.$$hashKey) {
			    	//cargar precio
			    	$scope.detalle[i].precio = item.producto.selected.precio;

			    	//seleccionar iva
					angular.forEach($scope.tipoivas,function (t,z) {
						if (t.name == item.producto.selected.tipoiva.name) {
							$scope.detalle[i].tipoiva = t;
							$scope.CalcularIVA(item);
							return false;
						}
					});
			    }else{
			    	//si es un servicio, seleccionar iva 21 por defecto
			    	//{_id: "5542ff36de651c636c70ecbe", idafip: 5, valor: 21, created: "2015-06-11T18:12:17.914Z", name: "21%"}
			    }
			});
		}

		$scope.CalcularIVA = function(item) {
			var v_iva = 0;
			$.each($scope.detalle, function(i){
			    if($scope.detalle[i].$$hashKey === item.$$hashKey) {
					if (!angular.isUndefined(item.producto.selected)) {
			    		v_iva = (item.cantidad * 
			    			    (item.precio-(item.precio*item.descuento))) * 
			    		        item.tipoiva.valor / 100 ;
			        	$scope.detalle[i].valoriva = v_iva;
			        	return false;

			    	}
				}
			});
			
			return v_iva;
		}

		$scope.CalcularSubTotal = function(item) {
			var v_subtotal = 0;
			var v_subtotal_neto = 0;

			$.each($scope.detalle, function(i){
			    if($scope.detalle[i].$$hashKey === item.$$hashKey) {
					if (!angular.isUndefined(item.producto.selected)) {
						//calculo subtotal con IVA
			    		v_subtotal = item.cantidad * 
			    		             (item.precio-(item.precio*item.descuento)) * 
			    		             (1 + item.tipoiva.valor / 100);
			        	$scope.detalle[i].subtotal = v_subtotal;

			        	//calculo subtotal NETO
			        	v_subtotal_neto = item.cantidad * 
			    		             (item.precio-(item.precio*item.descuento));
			        	
			        	$scope.detalle[i].neto = v_subtotal_neto;
			        	return false;
			    	}
			    }
			});
			
			$scope.CalcularTotales();

			return v_subtotal;
		};


		$scope.CalcularTotales = function() {
			
			var _netoNoGravado = 0;
			var _exento = 0;
			var _iva21 = 0;
			var _iva105 = 0;
			var _total = 0;
			var _neto1 = 0;

			$.each($scope.detalle, function(i){

				
				_total	+= $scope.detalle[i].subtotal;


				switch($scope.detalle[i].tipoiva.name){
					case '21%':
						_iva21 += $scope.detalle[i].valoriva;
						_neto1 += $scope.detalle[i].neto;
						break;
					case '10.5%':
						_iva105 += $scope.detalle[i].valoriva;
						_neto1 += $scope.detalle[i].neto;
						break;
					case 'Exento':
						_exento += $scope.detalle[i].neto;
						break;
					case 'No Gravado':
						_netoNoGravado += $scope.detalle[i].neto;
						break;
				}

				
			});

			
			$scope.netoNoGravado = _netoNoGravado;
			$scope.exento = _exento;
			$scope.total = _total;
			$scope.iva21 = _iva21;
			$scope.iva105 = _iva105;
			$scope.neto1 = _neto1;
		};

		// Create new Factura
		$scope.create = function() {
			// Create new Factura object
			if ($scope.myform.$valid) {
				//verificar si al menos tiene un item ingresado
				var cant_items_sin_producto = 0;

				var detalleitems = [];

				if ($scope.detalle.length>0) { //hay items
					$scope.detalle.forEach(function(item) {
						if (angular.isUndefined(item.producto.selected)){
							cant_items_sin_producto++;
						}else{
							detalleitems.push({
								cantidad: item.cantidad,
								producto: item.producto.selected._id,
								descripcion: item.producto.selected,
								precio: item.precio,
								descuento: item.descuento,
								tipoiva: item.tipoiva._id,
								valoriva: item.valoriva,
								subtotal: item.subtotal
							})
						}
					});
				}

				if (cant_items_sin_producto==$scope.detalle.length) {
      				$scope.error = 'Ingrese al menos un item en el detalle de la factura';
				}else{
			      	var factura = new Facturas ({
			      			puntoventa: ('10000' + $scope.authentication.user.settingempresa.puntoventa).slice(-4),
							numero: $scope.numero,
							numeroCompleto: $scope.numeroCompleto,
							tipoFac: $scope.TipoFactura,
							fecha: this.fecha,
							fechaCobro: this.fechaCobro,
							neto: $scope.neto1,
							netoNoGravado: $scope.netoNoGravado,
							exento: $scope.exento,
							total: $scope.total,
							iva21: $scope.iva21,
							iva105: $scope.iva105,
							tipocomprobante: $scope.TipoComprob,
							cliente: this.person.selected._id,
							items: detalleitems,
						});
			      	//guardo factura como borrador
			      	factura.$save(function(response) {

						var _id = response._id;

						//crear encabezado de factura
						var encabezado = {
							id: _id,
							tipo_doc: 80, // 80 -> cuit - 96 -> dni
							nro_doc: $scope.person.selected.cuit,
							tipo_cbte: $scope.tipo_cbte,
							punto_vta: ('10000' + $scope.authentication.user.settingempresa.puntoventa).slice(-4),
							cbte_nro: $scope.numero,
							fecha_cbte: $scope.fecha,
							concepto: $scope.authentication.user.settingempresa.facturaProductos ? 1 : 0,
							imp_total: $filter('number')($scope.total,2),
							imp_total_conc: $filter('number')($scope.netoNoGravado,2),
							imp_neto: $filter('number')($scope.neto1,2),
							imp_iva: $filter('number')($scope.iva21+$scope.iva105,2),
							imp_op_ex: $filter('number')($scope.exento,2),
							imp_trib: '0.00',
							moneda_id: 'PES',
							moneda_ctz: 1,
							fecha_vto_pago: $scope.authentication.user.settingempresa.facturaProductos ? undefined : $scope.fecha,
							fecha_serv_desde: $scope.authentication.user.settingempresa.facturaProductos ? undefined : $scope.fecha,
							fecha_serv_hasta: $scope.authentication.user.settingempresa.facturaProductos ? undefined : $scope.fecha,
						}

						var ivas = [];
						var iva21Obj = {
							id: $scope.numero,
							iva_id: 5,
							base_imp: $filter('number')($scope.iva21*100/21, 2),
							importe: $filter('number')($scope.iva21, 2)
						}

						var iva105Obj = {
							id: $scope.numero,
							iva_id: 4,
							base_imp: $filter('number')($scope.iva105*100/10.5, 2),
							importe: $filter('number')($scope.iva105, 2)
						}
						if ($scope.iva21>0) ivas.push(iva21Obj);
						if ($scope.iva105>0) ivas.push(iva105Obj);
						
						$http({
							url : 'http://localhost/wsfe/Service1.asmx/EmitirFactura',
							//url : 'http://localhost:15676/Service1.asmx/EmitirFactura',						    
							method : "POST", 
							data: { 'enc': encabezado, 'ivas': ivas },
							dataType: 'json',   
						}).success(function(data) {
						    var resp = data.d;
						    if (resp.resultado === 'A') {
						    	//todo ok
						    	factura.resultado = resp.resultado;
						    	factura.cae = resp.CAE;
						    	factura.vto_cae = moment(resp.VtoCAE, 'YYYYMMDD');
						    	factura.numero = resp.NroCbte;
						    	factura.numeroCompleto = $scope.TipoFactura.slice(-1) + '-' + $scope.formatNumberFactura(resp.NroCbte);
						    	factura.XmlRequest = resp.XMLRequest;
						    	factura.XmlResponse = resp.XMLResponse;
						    	factura.Msg = resp.Msg;

						    	factura.$update(function() {
									//$location.path('facturas/' + factura._id);
									alert('imprimir');
								}, function(errorResponse) {
									$scope.error = errorResponse.data.message;
								});
						    }else{
						    	//hay error
						    	alert(resp.Msg);
						    }

						}).error(function(data){ //, status, headers, config) {
						    alert(data.d.Msg);
						});

					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});	

					// Redirect after save
										
				}



    		} else {
      			$scope.error = 'Revise los datos ingresados';
    		}
			
		};


		$scope.enviarAfip = function(id) {

		}


		// Remove existing Factura
		$scope.remove = function(factura) {
			if ( factura ) { 
				factura.$remove();

				for (var i in $scope.facturas) {
					if ($scope.facturas [i] === factura) {
						$scope.facturas.splice(i, 1);
					}
				}
			} else {
				$scope.factura.$remove(function() {
					$location.path('facturas');
				});
			}
		};

		// Update existing Factura
		$scope.update = function() {
			var factura = $scope.factura;

			factura.$update(function() {
				$location.path('facturas/' + factura._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Facturas
		$scope.find = function() {
			$scope.facturas = Facturas.query();
		};

		// Find existing Factura
		$scope.findOne = function() {
			$scope.factura = Facturas.get({ 
				facturaId: $stateParams.facturaId
			});
		};

		$scope.initFactura = function() {
			$('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                orientation: 'left',
                autoclose: true
            });
            //$('.date-picker').inputmask('d/m/y',{ 'placeholder': 'dd/mm/yyyy' });
            $('.date-picker').inputmask('d/m/y');



            $scope.fecha = moment()._d;
            $scope.fechaCobro = moment().add(1, 'months')._d;
			$scope.TipoComprob = '0' //seleccionar Factura;
			$scope.generaNroFactura();


			//this.numero = $scope.formatNumberFactura($scope.numeroCompleto);
		};

		$scope.generaNroFactura = function(){
			if ($scope.authentication.user.settingempresa.condicioniva.idafip === 2) {
				//es monotributista
				//buscar si hay facturas C emitidas
				$scope.tipo_cbte = $scope.TipoComprob + 10; // 11: Factura C - 12: Nota de Debito - 13: Nota de Credito
				if ($scope.tipo_cbte===11) {
					$scope.TipoFactura = 'FC';
				}else if ($scope.tipo_cbte===12) {
					$scope.TipoFactura = 'NDC';
				}else{
					$scope.TipoFactura = 'NCC';
				}	
				$scope.getNroFactura();
			}else{
				//es RI
				//Verificar que tipo de iva tiene el cliente seleccionado.
				if (!angular.isUndefined(this.person.selected)){
					if(this.person.selected.condicioniva.idafip===1){
						//es RI, facturar con A
						$scope.tipo_cbte = $scope.TipoComprob; // 1: Factura A - 2: Nota de Debito - 3: Nota de Credito
						if ($scope.tipo_cbte===1) {
							$scope.TipoFactura = 'FA';
						}else if ($scope.tipo_cbte===2) {
							$scope.TipoFactura = 'NDA';
						}else{
							$scope.TipoFactura = 'NCA';
						}				
					}else{
						//facturar con B
						$scope.tipo_cbte = $scope.TipoComprob + 5; // 6: Factura B - 7: Nota de Debito - 8: Nota de Credito
						if ($scope.tipo_cbte===6) {
							$scope.TipoFactura = 'FB';
						}else if ($scope.tipo_cbte===7) {
							$scope.TipoFactura = 'NDB';
						}else{
							$scope.TipoFactura = 'NCB';
						}
					}
					$scope.numeroCompleto = 'Sin asignar';
				}else{
					//no hay cliente seleccionado
					$scope.numeroCompleto = 'Sin asignar';
				}
			}
		};

		$scope.getNroFactura = function(tipo){
			getNroFacturaService.query({
		        		tipofactura: tipo
		    	}, function(ultimafactura) {
					if (ultimafactura.length > 0) {
						//hay factura, leer numero y sumar 1
						$scope.numero = ultimafactura[0].numero + 1;
						$scope.numeroCompleto = tipo.slice(-1) + '-' + $scope.formatNumberFactura($scope.numero);
					}else{
						//ver en setting cual es el nro de incio de factura
						var primernro;
						if (tipo==='FC') {
							$scope.numero = $scope.authentication.user.settingempresa.nroFacturaC + 1;
							primernro =  $scope.formatNumberFactura($scope.numero);
						}else if (tipo==='FA') {
							$scope.numero = $scope.authentication.user.settingempresa.nroFacturaA + 1;
							primernro =  $scope.formatNumberFactura($scope.numero);
						}else{
							$scope.numero = $scope.authentication.user.settingempresa.nroFacturaB + 1
							primernro =  $scope.formatNumberFactura($scope.numero);
						}
						$scope.numeroCompleto = tipo.slice(-1) + '-' + primernro;
					}
		    	});
		};

		$scope.formatNumberFactura = function(nro) {
			var ptoventa = ('10000' + $scope.authentication.user.settingempresa.puntoventa).slice(-4);
			nro = ('100000000'+nro).slice(-8);
			return ptoventa + '-' + nro;
		};

		


	}
]);