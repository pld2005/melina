'use strict';

(function() {
	// Condicionivas Controller Spec
	describe('Condicionivas Controller Tests', function() {
		// Initialize global variables
		var CondicionivasController,
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

			// Initialize the Condicionivas controller.
			CondicionivasController = $controller('CondicionivasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Condicioniva object fetched from XHR', inject(function(Condicionivas) {
			// Create sample Condicioniva using the Condicionivas service
			var sampleCondicioniva = new Condicionivas({
				name: 'New Condicioniva'
			});

			// Create a sample Condicionivas array that includes the new Condicioniva
			var sampleCondicionivas = [sampleCondicioniva];

			// Set GET response
			$httpBackend.expectGET('condicionivas').respond(sampleCondicionivas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.condicionivas).toEqualData(sampleCondicionivas);
		}));

		it('$scope.findOne() should create an array with one Condicioniva object fetched from XHR using a condicionivaId URL parameter', inject(function(Condicionivas) {
			// Define a sample Condicioniva object
			var sampleCondicioniva = new Condicionivas({
				name: 'New Condicioniva'
			});

			// Set the URL parameter
			$stateParams.condicionivaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/condicionivas\/([0-9a-fA-F]{24})$/).respond(sampleCondicioniva);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.condicioniva).toEqualData(sampleCondicioniva);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Condicionivas) {
			// Create a sample Condicioniva object
			var sampleCondicionivaPostData = new Condicionivas({
				name: 'New Condicioniva'
			});

			// Create a sample Condicioniva response
			var sampleCondicionivaResponse = new Condicionivas({
				_id: '525cf20451979dea2c000001',
				name: 'New Condicioniva'
			});

			// Fixture mock form input values
			scope.name = 'New Condicioniva';

			// Set POST response
			$httpBackend.expectPOST('condicionivas', sampleCondicionivaPostData).respond(sampleCondicionivaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Condicioniva was created
			expect($location.path()).toBe('/condicionivas/' + sampleCondicionivaResponse._id);
		}));

		it('$scope.update() should update a valid Condicioniva', inject(function(Condicionivas) {
			// Define a sample Condicioniva put data
			var sampleCondicionivaPutData = new Condicionivas({
				_id: '525cf20451979dea2c000001',
				name: 'New Condicioniva'
			});

			// Mock Condicioniva in scope
			scope.condicioniva = sampleCondicionivaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/condicionivas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/condicionivas/' + sampleCondicionivaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid condicionivaId and remove the Condicioniva from the scope', inject(function(Condicionivas) {
			// Create new Condicioniva object
			var sampleCondicioniva = new Condicionivas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Condicionivas array and include the Condicioniva
			scope.condicionivas = [sampleCondicioniva];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/condicionivas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCondicioniva);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.condicionivas.length).toBe(0);
		}));
	});
}());