'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Condicioniva = mongoose.model('Condicioniva');

/**
 * Globals
 */
var user, condicioniva;

/**
 * Unit tests
 */
describe('Condicioniva Model Unit Tests:', function() {
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
			condicioniva = new Condicioniva({
				name: 'Condicioniva Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return condicioniva.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			condicioniva.name = '';

			return condicioniva.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Condicioniva.remove().exec();
		User.remove().exec();

		done();
	});
});