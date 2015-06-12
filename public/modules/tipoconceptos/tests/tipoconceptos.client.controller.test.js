'use strict';

(function() {
	// Tipoconceptos Controller Spec
	describe('Tipoconceptos Controller Tests', function() {
		// Initialize global variables
		var TipoconceptosController,
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

			// Initialize the Tipoconceptos controller.
			TipoconceptosController = $controller('TipoconceptosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tipoconcepto object fetched from XHR', inject(function(Tipoconceptos) {
			// Create sample Tipoconcepto using the Tipoconceptos service
			var sampleTipoconcepto = new Tipoconceptos({
				name: 'New Tipoconcepto'
			});

			// Create a sample Tipoconceptos array that includes the new Tipoconcepto
			var sampleTipoconceptos = [sampleTipoconcepto];

			// Set GET response
			$httpBackend.expectGET('tipoconceptos').respond(sampleTipoconceptos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tipoconceptos).toEqualData(sampleTipoconceptos);
		}));

		it('$scope.findOne() should create an array with one Tipoconcepto object fetched from XHR using a tipoconceptoId URL parameter', inject(function(Tipoconceptos) {
			// Define a sample Tipoconcepto object
			var sampleTipoconcepto = new Tipoconceptos({
				name: 'New Tipoconcepto'
			});

			// Set the URL parameter
			$stateParams.tipoconceptoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tipoconceptos\/([0-9a-fA-F]{24})$/).respond(sampleTipoconcepto);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tipoconcepto).toEqualData(sampleTipoconcepto);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tipoconceptos) {
			// Create a sample Tipoconcepto object
			var sampleTipoconceptoPostData = new Tipoconceptos({
				name: 'New Tipoconcepto'
			});

			// Create a sample Tipoconcepto response
			var sampleTipoconceptoResponse = new Tipoconceptos({
				_id: '525cf20451979dea2c000001',
				name: 'New Tipoconcepto'
			});

			// Fixture mock form input values
			scope.name = 'New Tipoconcepto';

			// Set POST response
			$httpBackend.expectPOST('tipoconceptos', sampleTipoconceptoPostData).respond(sampleTipoconceptoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tipoconcepto was created
			expect($location.path()).toBe('/tipoconceptos/' + sampleTipoconceptoResponse._id);
		}));

		it('$scope.update() should update a valid Tipoconcepto', inject(function(Tipoconceptos) {
			// Define a sample Tipoconcepto put data
			var sampleTipoconceptoPutData = new Tipoconceptos({
				_id: '525cf20451979dea2c000001',
				name: 'New Tipoconcepto'
			});

			// Mock Tipoconcepto in scope
			scope.tipoconcepto = sampleTipoconceptoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/tipoconceptos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tipoconceptos/' + sampleTipoconceptoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tipoconceptoId and remove the Tipoconcepto from the scope', inject(function(Tipoconceptos) {
			// Create new Tipoconcepto object
			var sampleTipoconcepto = new Tipoconceptos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tipoconceptos array and include the Tipoconcepto
			scope.tipoconceptos = [sampleTipoconcepto];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tipoconceptos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTipoconcepto);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tipoconceptos.length).toBe(0);
		}));
	});
}());