'use strict';

(function() {
	// Facturas Controller Spec
	describe('Facturas Controller Tests', function() {
		// Initialize global variables
		var FacturasController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Facturas controller.
			FacturasController = $controller('FacturasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Factura object fetched from XHR', inject(function(Facturas) {
			// Create sample Factura using the Facturas service
			var sampleFactura = new Facturas({
				name: 'New Factura'
			});

			// Create a sample Facturas array that includes the new Factura
			var sampleFacturas = [sampleFactura];

			// Set GET response
			$httpBackend.expectGET('facturas').respond(sampleFacturas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.facturas).toEqualData(sampleFacturas);
		}));

		it('$scope.findOne() should create an array with one Factura object fetched from XHR using a facturaId URL parameter', inject(function(Facturas) {
			// Define a sample Factura object
			var sampleFactura = new Facturas({
				name: 'New Factura'
			});

			// Set the URL parameter
			$stateParams.facturaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/facturas\/([0-9a-fA-F]{24})$/).respond(sampleFactura);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.factura).toEqualData(sampleFactura);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Facturas) {
			// Create a sample Factura object
			var sampleFacturaPostData = new Facturas({
				name: 'New Factura'
			});

			// Create a sample Factura response
			var sampleFacturaResponse = new Facturas({
				_id: '525cf20451979dea2c000001',
				name: 'New Factura'
			});

			// Fixture mock form input values
			scope.name = 'New Factura';

			// Set POST response
			$httpBackend.expectPOST('facturas', sampleFacturaPostData).respond(sampleFacturaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Factura was created
			expect($location.path()).toBe('/facturas/' + sampleFacturaResponse._id);
		}));

		it('$scope.update() should update a valid Factura', inject(function(Facturas) {
			// Define a sample Factura put data
			var sampleFacturaPutData = new Facturas({
				_id: '525cf20451979dea2c000001',
				name: 'New Factura'
			});

			// Mock Factura in scope
			scope.factura = sampleFacturaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/facturas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/facturas/' + sampleFacturaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid facturaId and remove the Factura from the scope', inject(function(Facturas) {
			// Create new Factura object
			var sampleFactura = new Facturas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Facturas array and include the Factura
			scope.facturas = [sampleFactura];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/facturas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFactura);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.facturas.length).toBe(0);
		}));
	});
}());