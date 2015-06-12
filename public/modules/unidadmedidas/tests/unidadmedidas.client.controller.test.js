'use strict';

(function() {
	// Unidadmedidas Controller Spec
	describe('Unidadmedidas Controller Tests', function() {
		// Initialize global variables
		var UnidadmedidasController,
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

			// Initialize the Unidadmedidas controller.
			UnidadmedidasController = $controller('UnidadmedidasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Unidadmedida object fetched from XHR', inject(function(Unidadmedidas) {
			// Create sample Unidadmedida using the Unidadmedidas service
			var sampleUnidadmedida = new Unidadmedidas({
				name: 'New Unidadmedida'
			});

			// Create a sample Unidadmedidas array that includes the new Unidadmedida
			var sampleUnidadmedidas = [sampleUnidadmedida];

			// Set GET response
			$httpBackend.expectGET('unidadmedidas').respond(sampleUnidadmedidas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.unidadmedidas).toEqualData(sampleUnidadmedidas);
		}));

		it('$scope.findOne() should create an array with one Unidadmedida object fetched from XHR using a unidadmedidaId URL parameter', inject(function(Unidadmedidas) {
			// Define a sample Unidadmedida object
			var sampleUnidadmedida = new Unidadmedidas({
				name: 'New Unidadmedida'
			});

			// Set the URL parameter
			$stateParams.unidadmedidaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/unidadmedidas\/([0-9a-fA-F]{24})$/).respond(sampleUnidadmedida);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.unidadmedida).toEqualData(sampleUnidadmedida);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Unidadmedidas) {
			// Create a sample Unidadmedida object
			var sampleUnidadmedidaPostData = new Unidadmedidas({
				name: 'New Unidadmedida'
			});

			// Create a sample Unidadmedida response
			var sampleUnidadmedidaResponse = new Unidadmedidas({
				_id: '525cf20451979dea2c000001',
				name: 'New Unidadmedida'
			});

			// Fixture mock form input values
			scope.name = 'New Unidadmedida';

			// Set POST response
			$httpBackend.expectPOST('unidadmedidas', sampleUnidadmedidaPostData).respond(sampleUnidadmedidaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Unidadmedida was created
			expect($location.path()).toBe('/unidadmedidas/' + sampleUnidadmedidaResponse._id);
		}));

		it('$scope.update() should update a valid Unidadmedida', inject(function(Unidadmedidas) {
			// Define a sample Unidadmedida put data
			var sampleUnidadmedidaPutData = new Unidadmedidas({
				_id: '525cf20451979dea2c000001',
				name: 'New Unidadmedida'
			});

			// Mock Unidadmedida in scope
			scope.unidadmedida = sampleUnidadmedidaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/unidadmedidas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/unidadmedidas/' + sampleUnidadmedidaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid unidadmedidaId and remove the Unidadmedida from the scope', inject(function(Unidadmedidas) {
			// Create new Unidadmedida object
			var sampleUnidadmedida = new Unidadmedidas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Unidadmedidas array and include the Unidadmedida
			scope.unidadmedidas = [sampleUnidadmedida];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/unidadmedidas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUnidadmedida);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.unidadmedidas.length).toBe(0);
		}));
	});
}());