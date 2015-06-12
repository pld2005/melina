'use strict';

(function() {
	// Proveedors Controller Spec
	describe('Proveedors Controller Tests', function() {
		// Initialize global variables
		var ProveedorsController,
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

			// Initialize the Proveedors controller.
			ProveedorsController = $controller('ProveedorsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Proveedor object fetched from XHR', inject(function(Proveedors) {
			// Create sample Proveedor using the Proveedors service
			var sampleProveedor = new Proveedors({
				name: 'New Proveedor'
			});

			// Create a sample Proveedors array that includes the new Proveedor
			var sampleProveedors = [sampleProveedor];

			// Set GET response
			$httpBackend.expectGET('proveedors').respond(sampleProveedors);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.proveedors).toEqualData(sampleProveedors);
		}));

		it('$scope.findOne() should create an array with one Proveedor object fetched from XHR using a proveedorId URL parameter', inject(function(Proveedors) {
			// Define a sample Proveedor object
			var sampleProveedor = new Proveedors({
				name: 'New Proveedor'
			});

			// Set the URL parameter
			$stateParams.proveedorId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/proveedors\/([0-9a-fA-F]{24})$/).respond(sampleProveedor);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.proveedor).toEqualData(sampleProveedor);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Proveedors) {
			// Create a sample Proveedor object
			var sampleProveedorPostData = new Proveedors({
				name: 'New Proveedor'
			});

			// Create a sample Proveedor response
			var sampleProveedorResponse = new Proveedors({
				_id: '525cf20451979dea2c000001',
				name: 'New Proveedor'
			});

			// Fixture mock form input values
			scope.name = 'New Proveedor';

			// Set POST response
			$httpBackend.expectPOST('proveedors', sampleProveedorPostData).respond(sampleProveedorResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Proveedor was created
			expect($location.path()).toBe('/proveedors/' + sampleProveedorResponse._id);
		}));

		it('$scope.update() should update a valid Proveedor', inject(function(Proveedors) {
			// Define a sample Proveedor put data
			var sampleProveedorPutData = new Proveedors({
				_id: '525cf20451979dea2c000001',
				name: 'New Proveedor'
			});

			// Mock Proveedor in scope
			scope.proveedor = sampleProveedorPutData;

			// Set PUT response
			$httpBackend.expectPUT(/proveedors\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/proveedors/' + sampleProveedorPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid proveedorId and remove the Proveedor from the scope', inject(function(Proveedors) {
			// Create new Proveedor object
			var sampleProveedor = new Proveedors({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Proveedors array and include the Proveedor
			scope.proveedors = [sampleProveedor];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/proveedors\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProveedor);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.proveedors.length).toBe(0);
		}));
	});
}());