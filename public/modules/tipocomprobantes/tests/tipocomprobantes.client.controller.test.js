'use strict';

(function() {
	// Tipocomprobantes Controller Spec
	describe('Tipocomprobantes Controller Tests', function() {
		// Initialize global variables
		var TipocomprobantesController,
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

			// Initialize the Tipocomprobantes controller.
			TipocomprobantesController = $controller('TipocomprobantesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tipocomprobante object fetched from XHR', inject(function(Tipocomprobantes) {
			// Create sample Tipocomprobante using the Tipocomprobantes service
			var sampleTipocomprobante = new Tipocomprobantes({
				name: 'New Tipocomprobante'
			});

			// Create a sample Tipocomprobantes array that includes the new Tipocomprobante
			var sampleTipocomprobantes = [sampleTipocomprobante];

			// Set GET response
			$httpBackend.expectGET('tipocomprobantes').respond(sampleTipocomprobantes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tipocomprobantes).toEqualData(sampleTipocomprobantes);
		}));

		it('$scope.findOne() should create an array with one Tipocomprobante object fetched from XHR using a tipocomprobanteId URL parameter', inject(function(Tipocomprobantes) {
			// Define a sample Tipocomprobante object
			var sampleTipocomprobante = new Tipocomprobantes({
				name: 'New Tipocomprobante'
			});

			// Set the URL parameter
			$stateParams.tipocomprobanteId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tipocomprobantes\/([0-9a-fA-F]{24})$/).respond(sampleTipocomprobante);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tipocomprobante).toEqualData(sampleTipocomprobante);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tipocomprobantes) {
			// Create a sample Tipocomprobante object
			var sampleTipocomprobantePostData = new Tipocomprobantes({
				name: 'New Tipocomprobante'
			});

			// Create a sample Tipocomprobante response
			var sampleTipocomprobanteResponse = new Tipocomprobantes({
				_id: '525cf20451979dea2c000001',
				name: 'New Tipocomprobante'
			});

			// Fixture mock form input values
			scope.name = 'New Tipocomprobante';

			// Set POST response
			$httpBackend.expectPOST('tipocomprobantes', sampleTipocomprobantePostData).respond(sampleTipocomprobanteResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tipocomprobante was created
			expect($location.path()).toBe('/tipocomprobantes/' + sampleTipocomprobanteResponse._id);
		}));

		it('$scope.update() should update a valid Tipocomprobante', inject(function(Tipocomprobantes) {
			// Define a sample Tipocomprobante put data
			var sampleTipocomprobantePutData = new Tipocomprobantes({
				_id: '525cf20451979dea2c000001',
				name: 'New Tipocomprobante'
			});

			// Mock Tipocomprobante in scope
			scope.tipocomprobante = sampleTipocomprobantePutData;

			// Set PUT response
			$httpBackend.expectPUT(/tipocomprobantes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tipocomprobantes/' + sampleTipocomprobantePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tipocomprobanteId and remove the Tipocomprobante from the scope', inject(function(Tipocomprobantes) {
			// Create new Tipocomprobante object
			var sampleTipocomprobante = new Tipocomprobantes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tipocomprobantes array and include the Tipocomprobante
			scope.tipocomprobantes = [sampleTipocomprobante];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tipocomprobantes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTipocomprobante);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tipocomprobantes.length).toBe(0);
		}));
	});
}());