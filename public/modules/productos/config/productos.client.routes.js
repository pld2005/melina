'use strict';

//Setting up route
angular.module('productos').config(['$stateProvider',
	function($stateProvider) {
		// Productos state routing
		$stateProvider.
		state('listProductos', {
			url: '/productos',
			data: {pageTitle: 'Productos', pageSubTitle: 'Listado de productos.'},
			templateUrl: 'modules/productos/views/list-productos.client.view.html'
		}).
		state('createProducto', {
			url: '/productos/create',
			data: {pageTitle: 'Productos', pageSubTitle: 'Complete el formulario para crear un producto o servicio.'},
			templateUrl: 'modules/productos/views/create-producto.client.view.html'
		}).
		state('viewProducto', {
			url: '/productos/:productoId',
			templateUrl: 'modules/productos/views/view-producto.client.view.html'
		}).
		state('editProducto', {
			url: '/productos/:productoId/edit',
			data: {pageTitle: 'Productos', pageSubTitle: 'Edición de producto o servicio.'},			
			templateUrl: 'modules/productos/views/edit-producto.client.view.html'
		});
	}
]);