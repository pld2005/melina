'use strict';

(function() {
	// Localidads Controller Spec
	describe('Localidads Controller Tests', function() {
		// Initialize global variables
		var LocalidadsController,
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

			// Initialize the Localidads controller.
			LocalidadsController = $controller('LocalidadsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Localidad object fetched from XHR', inject(function(Localidads) {
			// Create sample Localidad using the Localidads service
			var sampleLocalidad = new Localidads({
				name: 'New Localidad'
			});

			// Create a sample Localidads array that includes the new Localidad
			var sampleLocalidads = [sampleLocalidad];

			// Set GET response
			$httpBackend.expectGET('localidads').respond(sampleLocalidads);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.localidads).toEqualData(sampleLocalidads);
		}));

		it('$scope.findOne() should create an array with one Localidad object fetched from XHR using a localidadId URL parameter', inject(function(Localidads) {
			// Define a sample Localidad object
			var sampleLocalidad = new Localidads({
				name: 'New Localidad'
			});

			// Set the URL parameter
			$stateParams.localidadId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/localidads\/([0-9a-fA-F]{24})$/).respond(sampleLocalidad);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.localidad).toEqualData(sampleLocalidad);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Localidads) {
			// Create a sample Localidad object
			var sampleLocalidadPostData = new Localidads({
				name: 'New Localidad'
			});

			// Create a sample Localidad response
			var sampleLocalidadResponse = new Localidads({
				_id: '525cf20451979dea2c000001',
				name: 'New Localidad'
			});

			// Fixture mock form input values
			scope.name = 'New Localidad';

			// Set POST response
			$httpBackend.expectPOST('localidads', sampleLocalidadPostData).respond(sampleLocalidadResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Localidad was created
			expect($location.path()).toBe('/localidads/' + sampleLocalidadResponse._id);
		}));

		it('$scope.update() should update a valid Localidad', inject(function(Localidads) {
			// Define a sample Localidad put data
			var sampleLocalidadPutData = new Localidads({
				_id: '525cf20451979dea2c000001',
				name: 'New Localidad'
			});

			// Mock Localidad in scope
			scope.localidad = sampleLocalidadPutData;

			// Set PUT response
			$httpBackend.expectPUT(/localidads\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/localidads/' + sampleLocalidadPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid localidadId and remove the Localidad from the scope', inject(function(Localidads) {
			// Create new Localidad object
			var sampleLocalidad = new Localidads({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Localidads array and include the Localidad
			scope.localidads = [sampleLocalidad];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/localidads\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLocalidad);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.localidads.length).toBe(0);
		}));
	});
}());