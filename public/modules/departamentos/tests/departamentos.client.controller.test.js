'use strict';

(function() {
	// Departamentos Controller Spec
	describe('Departamentos Controller Tests', function() {
		// Initialize global variables
		var DepartamentosController,
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

			// Initialize the Departamentos controller.
			DepartamentosController = $controller('DepartamentosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Departamento object fetched from XHR', inject(function(Departamentos) {
			// Create sample Departamento using the Departamentos service
			var sampleDepartamento = new Departamentos({
				name: 'New Departamento'
			});

			// Create a sample Departamentos array that includes the new Departamento
			var sampleDepartamentos = [sampleDepartamento];

			// Set GET response
			$httpBackend.expectGET('departamentos').respond(sampleDepartamentos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.departamentos).toEqualData(sampleDepartamentos);
		}));

		it('$scope.findOne() should create an array with one Departamento object fetched from XHR using a departamentoId URL parameter', inject(function(Departamentos) {
			// Define a sample Departamento object
			var sampleDepartamento = new Departamentos({
				name: 'New Departamento'
			});

			// Set the URL parameter
			$stateParams.departamentoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/departamentos\/([0-9a-fA-F]{24})$/).respond(sampleDepartamento);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.departamento).toEqualData(sampleDepartamento);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Departamentos) {
			// Create a sample Departamento object
			var sampleDepartamentoPostData = new Departamentos({
				name: 'New Departamento'
			});

			// Create a sample Departamento response
			var sampleDepartamentoResponse = new Departamentos({
				_id: '525cf20451979dea2c000001',
				name: 'New Departamento'
			});

			// Fixture mock form input values
			scope.name = 'New Departamento';

			// Set POST response
			$httpBackend.expectPOST('departamentos', sampleDepartamentoPostData).respond(sampleDepartamentoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Departamento was created
			expect($location.path()).toBe('/departamentos/' + sampleDepartamentoResponse._id);
		}));

		it('$scope.update() should update a valid Departamento', inject(function(Departamentos) {
			// Define a sample Departamento put data
			var sampleDepartamentoPutData = new Departamentos({
				_id: '525cf20451979dea2c000001',
				name: 'New Departamento'
			});

			// Mock Departamento in scope
			scope.departamento = sampleDepartamentoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/departamentos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/departamentos/' + sampleDepartamentoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid departamentoId and remove the Departamento from the scope', inject(function(Departamentos) {
			// Create new Departamento object
			var sampleDepartamento = new Departamentos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Departamentos array and include the Departamento
			scope.departamentos = [sampleDepartamento];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/departamentos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDepartamento);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.departamentos.length).toBe(0);
		}));
	});
}());