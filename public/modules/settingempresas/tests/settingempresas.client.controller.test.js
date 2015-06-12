'use strict';

(function() {
	// Settingempresas Controller Spec
	describe('Settingempresas Controller Tests', function() {
		// Initialize global variables
		var SettingempresasController,
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

			// Initialize the Settingempresas controller.
			SettingempresasController = $controller('SettingempresasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Settingempresa object fetched from XHR', inject(function(Settingempresas) {
			// Create sample Settingempresa using the Settingempresas service
			var sampleSettingempresa = new Settingempresas({
				name: 'New Settingempresa'
			});

			// Create a sample Settingempresas array that includes the new Settingempresa
			var sampleSettingempresas = [sampleSettingempresa];

			// Set GET response
			$httpBackend.expectGET('settingempresas').respond(sampleSettingempresas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.settingempresas).toEqualData(sampleSettingempresas);
		}));

		it('$scope.findOne() should create an array with one Settingempresa object fetched from XHR using a settingempresaId URL parameter', inject(function(Settingempresas) {
			// Define a sample Settingempresa object
			var sampleSettingempresa = new Settingempresas({
				name: 'New Settingempresa'
			});

			// Set the URL parameter
			$stateParams.settingempresaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/settingempresas\/([0-9a-fA-F]{24})$/).respond(sampleSettingempresa);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.settingempresa).toEqualData(sampleSettingempresa);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Settingempresas) {
			// Create a sample Settingempresa object
			var sampleSettingempresaPostData = new Settingempresas({
				name: 'New Settingempresa'
			});

			// Create a sample Settingempresa response
			var sampleSettingempresaResponse = new Settingempresas({
				_id: '525cf20451979dea2c000001',
				name: 'New Settingempresa'
			});

			// Fixture mock form input values
			scope.name = 'New Settingempresa';

			// Set POST response
			$httpBackend.expectPOST('settingempresas', sampleSettingempresaPostData).respond(sampleSettingempresaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Settingempresa was created
			expect($location.path()).toBe('/settingempresas/' + sampleSettingempresaResponse._id);
		}));

		it('$scope.update() should update a valid Settingempresa', inject(function(Settingempresas) {
			// Define a sample Settingempresa put data
			var sampleSettingempresaPutData = new Settingempresas({
				_id: '525cf20451979dea2c000001',
				name: 'New Settingempresa'
			});

			// Mock Settingempresa in scope
			scope.settingempresa = sampleSettingempresaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/settingempresas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/settingempresas/' + sampleSettingempresaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid settingempresaId and remove the Settingempresa from the scope', inject(function(Settingempresas) {
			// Create new Settingempresa object
			var sampleSettingempresa = new Settingempresas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Settingempresas array and include the Settingempresa
			scope.settingempresas = [sampleSettingempresa];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/settingempresas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSettingempresa);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.settingempresas.length).toBe(0);
		}));
	});
}());