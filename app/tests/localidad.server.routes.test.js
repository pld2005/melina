'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Localidad = mongoose.model('Localidad'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, localidad;

/**
 * Localidad routes tests
 */
describe('Localidad CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Localidad
		user.save(function() {
			localidad = {
				name: 'Localidad Name'
			};

			done();
		});
	});

	it('should be able to save Localidad instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Localidad
				agent.post('/localidads')
					.send(localidad)
					.expect(200)
					.end(function(localidadSaveErr, localidadSaveRes) {
						// Handle Localidad save error
						if (localidadSaveErr) done(localidadSaveErr);

						// Get a list of Localidads
						agent.get('/localidads')
							.end(function(localidadsGetErr, localidadsGetRes) {
								// Handle Localidad save error
								if (localidadsGetErr) done(localidadsGetErr);

								// Get Localidads list
								var localidads = localidadsGetRes.body;

								// Set assertions
								(localidads[0].user._id).should.equal(userId);
								(localidads[0].name).should.match('Localidad Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Localidad instance if not logged in', function(done) {
		agent.post('/localidads')
			.send(localidad)
			.expect(401)
			.end(function(localidadSaveErr, localidadSaveRes) {
				// Call the assertion callback
				done(localidadSaveErr);
			});
	});

	it('should not be able to save Localidad instance if no name is provided', function(done) {
		// Invalidate name field
		localidad.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Localidad
				agent.post('/localidads')
					.send(localidad)
					.expect(400)
					.end(function(localidadSaveErr, localidadSaveRes) {
						// Set message assertion
						(localidadSaveRes.body.message).should.match('Please fill Localidad name');
						
						// Handle Localidad save error
						done(localidadSaveErr);
					});
			});
	});

	it('should be able to update Localidad instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Localidad
				agent.post('/localidads')
					.send(localidad)
					.expect(200)
					.end(function(localidadSaveErr, localidadSaveRes) {
						// Handle Localidad save error
						if (localidadSaveErr) done(localidadSaveErr);

						// Update Localidad name
						localidad.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Localidad
						agent.put('/localidads/' + localidadSaveRes.body._id)
							.send(localidad)
							.expect(200)
							.end(function(localidadUpdateErr, localidadUpdateRes) {
								// Handle Localidad update error
								if (localidadUpdateErr) done(localidadUpdateErr);

								// Set assertions
								(localidadUpdateRes.body._id).should.equal(localidadSaveRes.body._id);
								(localidadUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Localidads if not signed in', function(done) {
		// Create new Localidad model instance
		var localidadObj = new Localidad(localidad);

		// Save the Localidad
		localidadObj.save(function() {
			// Request Localidads
			request(app).get('/localidads')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Localidad if not signed in', function(done) {
		// Create new Localidad model instance
		var localidadObj = new Localidad(localidad);

		// Save the Localidad
		localidadObj.save(function() {
			request(app).get('/localidads/' + localidadObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', localidad.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Localidad instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Localidad
				agent.post('/localidads')
					.send(localidad)
					.expect(200)
					.end(function(localidadSaveErr, localidadSaveRes) {
						// Handle Localidad save error
						if (localidadSaveErr) done(localidadSaveErr);

						// Delete existing Localidad
						agent.delete('/localidads/' + localidadSaveRes.body._id)
							.send(localidad)
							.expect(200)
							.end(function(localidadDeleteErr, localidadDeleteRes) {
								// Handle Localidad error error
								if (localidadDeleteErr) done(localidadDeleteErr);

								// Set assertions
								(localidadDeleteRes.body._id).should.equal(localidadSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Localidad instance if not signed in', function(done) {
		// Set Localidad user 
		localidad.user = user;

		// Create new Localidad model instance
		var localidadObj = new Localidad(localidad);

		// Save the Localidad
		localidadObj.save(function() {
			// Try deleting Localidad
			request(app).delete('/localidads/' + localidadObj._id)
			.expect(401)
			.end(function(localidadDeleteErr, localidadDeleteRes) {
				// Set message assertion
				(localidadDeleteRes.body.message).should.match('User is not logged in');

				// Handle Localidad error error
				done(localidadDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Localidad.remove().exec();
		done();
	});
});