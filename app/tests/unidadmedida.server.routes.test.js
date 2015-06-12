'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Unidadmedida = mongoose.model('Unidadmedida'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, unidadmedida;

/**
 * Unidadmedida routes tests
 */
describe('Unidadmedida CRUD tests', function() {
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

		// Save a user to the test db and create new Unidadmedida
		user.save(function() {
			unidadmedida = {
				name: 'Unidadmedida Name'
			};

			done();
		});
	});

	it('should be able to save Unidadmedida instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Unidadmedida
				agent.post('/unidadmedidas')
					.send(unidadmedida)
					.expect(200)
					.end(function(unidadmedidaSaveErr, unidadmedidaSaveRes) {
						// Handle Unidadmedida save error
						if (unidadmedidaSaveErr) done(unidadmedidaSaveErr);

						// Get a list of Unidadmedidas
						agent.get('/unidadmedidas')
							.end(function(unidadmedidasGetErr, unidadmedidasGetRes) {
								// Handle Unidadmedida save error
								if (unidadmedidasGetErr) done(unidadmedidasGetErr);

								// Get Unidadmedidas list
								var unidadmedidas = unidadmedidasGetRes.body;

								// Set assertions
								(unidadmedidas[0].user._id).should.equal(userId);
								(unidadmedidas[0].name).should.match('Unidadmedida Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Unidadmedida instance if not logged in', function(done) {
		agent.post('/unidadmedidas')
			.send(unidadmedida)
			.expect(401)
			.end(function(unidadmedidaSaveErr, unidadmedidaSaveRes) {
				// Call the assertion callback
				done(unidadmedidaSaveErr);
			});
	});

	it('should not be able to save Unidadmedida instance if no name is provided', function(done) {
		// Invalidate name field
		unidadmedida.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Unidadmedida
				agent.post('/unidadmedidas')
					.send(unidadmedida)
					.expect(400)
					.end(function(unidadmedidaSaveErr, unidadmedidaSaveRes) {
						// Set message assertion
						(unidadmedidaSaveRes.body.message).should.match('Please fill Unidadmedida name');
						
						// Handle Unidadmedida save error
						done(unidadmedidaSaveErr);
					});
			});
	});

	it('should be able to update Unidadmedida instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Unidadmedida
				agent.post('/unidadmedidas')
					.send(unidadmedida)
					.expect(200)
					.end(function(unidadmedidaSaveErr, unidadmedidaSaveRes) {
						// Handle Unidadmedida save error
						if (unidadmedidaSaveErr) done(unidadmedidaSaveErr);

						// Update Unidadmedida name
						unidadmedida.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Unidadmedida
						agent.put('/unidadmedidas/' + unidadmedidaSaveRes.body._id)
							.send(unidadmedida)
							.expect(200)
							.end(function(unidadmedidaUpdateErr, unidadmedidaUpdateRes) {
								// Handle Unidadmedida update error
								if (unidadmedidaUpdateErr) done(unidadmedidaUpdateErr);

								// Set assertions
								(unidadmedidaUpdateRes.body._id).should.equal(unidadmedidaSaveRes.body._id);
								(unidadmedidaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Unidadmedidas if not signed in', function(done) {
		// Create new Unidadmedida model instance
		var unidadmedidaObj = new Unidadmedida(unidadmedida);

		// Save the Unidadmedida
		unidadmedidaObj.save(function() {
			// Request Unidadmedidas
			request(app).get('/unidadmedidas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Unidadmedida if not signed in', function(done) {
		// Create new Unidadmedida model instance
		var unidadmedidaObj = new Unidadmedida(unidadmedida);

		// Save the Unidadmedida
		unidadmedidaObj.save(function() {
			request(app).get('/unidadmedidas/' + unidadmedidaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', unidadmedida.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Unidadmedida instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Unidadmedida
				agent.post('/unidadmedidas')
					.send(unidadmedida)
					.expect(200)
					.end(function(unidadmedidaSaveErr, unidadmedidaSaveRes) {
						// Handle Unidadmedida save error
						if (unidadmedidaSaveErr) done(unidadmedidaSaveErr);

						// Delete existing Unidadmedida
						agent.delete('/unidadmedidas/' + unidadmedidaSaveRes.body._id)
							.send(unidadmedida)
							.expect(200)
							.end(function(unidadmedidaDeleteErr, unidadmedidaDeleteRes) {
								// Handle Unidadmedida error error
								if (unidadmedidaDeleteErr) done(unidadmedidaDeleteErr);

								// Set assertions
								(unidadmedidaDeleteRes.body._id).should.equal(unidadmedidaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Unidadmedida instance if not signed in', function(done) {
		// Set Unidadmedida user 
		unidadmedida.user = user;

		// Create new Unidadmedida model instance
		var unidadmedidaObj = new Unidadmedida(unidadmedida);

		// Save the Unidadmedida
		unidadmedidaObj.save(function() {
			// Try deleting Unidadmedida
			request(app).delete('/unidadmedidas/' + unidadmedidaObj._id)
			.expect(401)
			.end(function(unidadmedidaDeleteErr, unidadmedidaDeleteRes) {
				// Set message assertion
				(unidadmedidaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Unidadmedida error error
				done(unidadmedidaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Unidadmedida.remove().exec();
		done();
	});
});