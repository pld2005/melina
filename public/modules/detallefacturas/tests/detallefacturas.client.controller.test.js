'use strict';

(function() {
	// Detallefacturas Controller Spec
	describe('Detallefacturas Controller Tests', function() {
		// Initialize global variables
		var DetallefacturasController,
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

			// Initialize the Detallefacturas controller.
			DetallefacturasController = $controller('DetallefacturasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Detallefactura object fetched from XHR', inject(function(Detallefacturas) {
			// Create sample Detallefactura using the Detallefacturas service
			var sampleDetallefactura = new Detallefacturas({
				name: 'New Detallefactura'
			});

			// Create a sample Detallefacturas array that includes the new Detallefactura
			var sampleDetallefacturas = [sampleDetallefactura];

			// Set GET response
			$httpBackend.expectGET('detallefacturas').respond(sampleDetallefacturas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.detallefacturas).toEqualData(sampleDetallefacturas);
		}));

		it('$scope.findOne() should create an array with one Detallefactura object fetched from XHR using a detallefacturaId URL parameter', inject(function(Detallefacturas) {
			// Define a sample Detallefactura object
			var sampleDetallefactura = new Detallefacturas({
				name: 'New Detallefactura'
			});

			// Set the URL parameter
			$stateParams.detallefacturaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/detallefacturas\/([0-9a-fA-F]{24})$/).respond(sampleDetallefactura);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.detallefactura).toEqualData(sampleDetallefactura);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Detallefacturas) {
			// Create a sample Detallefactura object
			var sampleDetallefacturaPostData = new Detallefacturas({
				name: 'New Detallefactura'
			});

			// Create a sample Detallefactura response
			var sampleDetallefacturaResponse = new Detallefacturas({
				_id: '525cf20451979dea2c000001',
				name: 'New Detallefactura'
			});

			// Fixture mock form input values
			scope.name = 'New Detallefactura';

			// Set POST response
			$httpBackend.expectPOST('detallefacturas', sampleDetallefacturaPostData).respond(sampleDetallefacturaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Detallefactura was created
			expect($location.path()).toBe('/detallefacturas/' + sampleDetallefacturaResponse._id);
		}));

		it('$scope.update() should update a valid Detallefactura', inject(function(Detallefacturas) {
			// Define a sample Detallefactura put data
			var sampleDetallefacturaPutData = new Detallefacturas({
				_id: '525cf20451979dea2c000001',
				name: 'New Detallefactura'
			});

			// Mock Detallefactura in scope
			scope.detallefactura = sampleDetallefacturaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/detallefacturas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/detallefacturas/' + sampleDetallefacturaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid detallefacturaId and remove the Detallefactura from the scope', inject(function(Detallefacturas) {
			// Create new Detallefactura object
			var sampleDetallefactura = new Detallefacturas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Detallefacturas array and include the Detallefactura
			scope.detallefacturas = [sampleDetallefactura];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/detallefacturas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDetallefactura);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.detallefacturas.length).toBe(0);
		}));
	});
}());