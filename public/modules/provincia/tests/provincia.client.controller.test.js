'use strict';

(function() {
	// Provincia Controller Spec
	describe('Provincia Controller Tests', function() {
		// Initialize global variables
		var ProvinciaController,
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

			// Initialize the Provincia controller.
			ProvinciaController = $controller('ProvinciaController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Provincium object fetched from XHR', inject(function(Provincia) {
			// Create sample Provincium using the Provincia service
			var sampleProvincium = new Provincia({
				name: 'New Provincium'
			});

			// Create a sample Provincia array that includes the new Provincium
			var sampleProvincia = [sampleProvincium];

			// Set GET response
			$httpBackend.expectGET('provincia').respond(sampleProvincia);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.provincia).toEqualData(sampleProvincia);
		}));

		it('$scope.findOne() should create an array with one Provincium object fetched from XHR using a provinciumId URL parameter', inject(function(Provincia) {
			// Define a sample Provincium object
			var sampleProvincium = new Provincia({
				name: 'New Provincium'
			});

			// Set the URL parameter
			$stateParams.provinciumId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/provincia\/([0-9a-fA-F]{24})$/).respond(sampleProvincium);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.provincium).toEqualData(sampleProvincium);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Provincia) {
			// Create a sample Provincium object
			var sampleProvinciumPostData = new Provincia({
				name: 'New Provincium'
			});

			// Create a sample Provincium response
			var sampleProvinciumResponse = new Provincia({
				_id: '525cf20451979dea2c000001',
				name: 'New Provincium'
			});

			// Fixture mock form input values
			scope.name = 'New Provincium';

			// Set POST response
			$httpBackend.expectPOST('provincia', sampleProvinciumPostData).respond(sampleProvinciumResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Provincium was created
			expect($location.path()).toBe('/provincia/' + sampleProvinciumResponse._id);
		}));

		it('$scope.update() should update a valid Provincium', inject(function(Provincia) {
			// Define a sample Provincium put data
			var sampleProvinciumPutData = new Provincia({
				_id: '525cf20451979dea2c000001',
				name: 'New Provincium'
			});

			// Mock Provincium in scope
			scope.provincium = sampleProvinciumPutData;

			// Set PUT response
			$httpBackend.expectPUT(/provincia\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/provincia/' + sampleProvinciumPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid provinciumId and remove the Provincium from the scope', inject(function(Provincia) {
			// Create new Provincium object
			var sampleProvincium = new Provincia({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Provincia array and include the Provincium
			scope.provincia = [sampleProvincium];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/provincia\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProvincium);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.provincia.length).toBe(0);
		}));
	});
}());