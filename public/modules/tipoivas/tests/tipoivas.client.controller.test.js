'use strict';

(function() {
	// Tipoivas Controller Spec
	describe('Tipoivas Controller Tests', function() {
		// Initialize global variables
		var TipoivasController,
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

			// Initialize the Tipoivas controller.
			TipoivasController = $controller('TipoivasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tipoiva object fetched from XHR', inject(function(Tipoivas) {
			// Create sample Tipoiva using the Tipoivas service
			var sampleTipoiva = new Tipoivas({
				name: 'New Tipoiva'
			});

			// Create a sample Tipoivas array that includes the new Tipoiva
			var sampleTipoivas = [sampleTipoiva];

			// Set GET response
			$httpBackend.expectGET('tipoivas').respond(sampleTipoivas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tipoivas).toEqualData(sampleTipoivas);
		}));

		it('$scope.findOne() should create an array with one Tipoiva object fetched from XHR using a tipoivaId URL parameter', inject(function(Tipoivas) {
			// Define a sample Tipoiva object
			var sampleTipoiva = new Tipoivas({
				name: 'New Tipoiva'
			});

			// Set the URL parameter
			$stateParams.tipoivaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tipoivas\/([0-9a-fA-F]{24})$/).respond(sampleTipoiva);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tipoiva).toEqualData(sampleTipoiva);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tipoivas) {
			// Create a sample Tipoiva object
			var sampleTipoivaPostData = new Tipoivas({
				name: 'New Tipoiva'
			});

			// Create a sample Tipoiva response
			var sampleTipoivaResponse = new Tipoivas({
				_id: '525cf20451979dea2c000001',
				name: 'New Tipoiva'
			});

			// Fixture mock form input values
			scope.name = 'New Tipoiva';

			// Set POST response
			$httpBackend.expectPOST('tipoivas', sampleTipoivaPostData).respond(sampleTipoivaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tipoiva was created
			expect($location.path()).toBe('/tipoivas/' + sampleTipoivaResponse._id);
		}));

		it('$scope.update() should update a valid Tipoiva', inject(function(Tipoivas) {
			// Define a sample Tipoiva put data
			var sampleTipoivaPutData = new Tipoivas({
				_id: '525cf20451979dea2c000001',
				name: 'New Tipoiva'
			});

			// Mock Tipoiva in scope
			scope.tipoiva = sampleTipoivaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/tipoivas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tipoivas/' + sampleTipoivaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tipoivaId and remove the Tipoiva from the scope', inject(function(Tipoivas) {
			// Create new Tipoiva object
			var sampleTipoiva = new Tipoivas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tipoivas array and include the Tipoiva
			scope.tipoivas = [sampleTipoiva];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tipoivas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTipoiva);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tipoivas.length).toBe(0);
		}));
	});
}());