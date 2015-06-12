'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Detallefactura = mongoose.model('Detallefactura');

/**
 * Globals
 */
var user, detallefactura;

/**
 * Unit tests
 */
describe('Detallefactura Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			detallefactura = new Detallefactura({
				name: 'Detallefactura Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return detallefactura.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			detallefactura.name = '';

			return detallefactura.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Detallefactura.remove().exec();
		User.remove().exec();

		done();
	});
});