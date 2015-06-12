'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Detallefactura = mongoose.model('Detallefactura'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, detallefactura;

/**
 * Detallefactura routes tests
 */
describe('Detallefactura CRUD tests', function() {
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

		// Save a user to the test db and create new Detallefactura
		user.save(function() {
			detallefactura = {
				name: 'Detallefactura Name'
			};

			done();
		});
	});

	it('should be able to save Detallefactura instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Detallefactura
				agent.post('/detallefacturas')
					.send(detallefactura)
					.expect(200)
					.end(function(detallefacturaSaveErr, detallefacturaSaveRes) {
						// Handle Detallefactura save error
						if (detallefacturaSaveErr) done(detallefacturaSaveErr);

						// Get a list of Detallefacturas
						agent.get('/detallefacturas')
							.end(function(detallefacturasGetErr, detallefacturasGetRes) {
								// Handle Detallefactura save error
								if (detallefacturasGetErr) done(detallefacturasGetErr);

								// Get Detallefacturas list
								var detallefacturas = detallefacturasGetRes.body;

								// Set assertions
								(detallefacturas[0].user._id).should.equal(userId);
								(detallefacturas[0].name).should.match('Detallefactura Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Detallefactura instance if not logged in', function(done) {
		agent.post('/detallefacturas')
			.send(detallefactura)
			.expect(401)
			.end(function(detallefacturaSaveErr, detallefacturaSaveRes) {
				// Call the assertion callback
				done(detallefacturaSaveErr);
			});
	});

	it('should not be able to save Detallefactura instance if no name is provided', function(done) {
		// Invalidate name field
		detallefactura.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Detallefactura
				agent.post('/detallefacturas')
					.send(detallefactura)
					.expect(400)
					.end(function(detallefacturaSaveErr, detallefacturaSaveRes) {
						// Set message assertion
						(detallefacturaSaveRes.body.message).should.match('Please fill Detallefactura name');
						
						// Handle Detallefactura save error
						done(detallefacturaSaveErr);
					});
			});
	});

	it('should be able to update Detallefactura instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Detallefactura
				agent.post('/detallefacturas')
					.send(detallefactura)
					.expect(200)
					.end(function(detallefacturaSaveErr, detallefacturaSaveRes) {
						// Handle Detallefactura save error
						if (detallefacturaSaveErr) done(detallefacturaSaveErr);

						// Update Detallefactura name
						detallefactura.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Detallefactura
						agent.put('/detallefacturas/' + detallefacturaSaveRes.body._id)
							.send(detallefactura)
							.expect(200)
							.end(function(detallefacturaUpdateErr, detallefacturaUpdateRes) {
								// Handle Detallefactura update error
								if (detallefacturaUpdateErr) done(detallefacturaUpdateErr);

								// Set assertions
								(detallefacturaUpdateRes.body._id).should.equal(detallefacturaSaveRes.body._id);
								(detallefacturaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Detallefacturas if not signed in', function(done) {
		// Create new Detallefactura model instance
		var detallefacturaObj = new Detallefactura(detallefactura);

		// Save the Detallefactura
		detallefacturaObj.save(function() {
			// Request Detallefacturas
			request(app).get('/detallefacturas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Detallefactura if not signed in', function(done) {
		// Create new Detallefactura model instance
		var detallefacturaObj = new Detallefactura(detallefactura);

		// Save the Detallefactura
		detallefacturaObj.save(function() {
			request(app).get('/detallefacturas/' + detallefacturaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', detallefactura.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Detallefactura instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Detallefactura
				agent.post('/detallefacturas')
					.send(detallefactura)
					.expect(200)
					.end(function(detallefacturaSaveErr, detallefacturaSaveRes) {
						// Handle Detallefactura save error
						if (detallefacturaSaveErr) done(detallefacturaSaveErr);

						// Delete existing Detallefactura
						agent.delete('/detallefacturas/' + detallefacturaSaveRes.body._id)
							.send(detallefactura)
							.expect(200)
							.end(function(detallefacturaDeleteErr, detallefacturaDeleteRes) {
								// Handle Detallefactura error error
								if (detallefacturaDeleteErr) done(detallefacturaDeleteErr);

								// Set assertions
								(detallefacturaDeleteRes.body._id).should.equal(detallefacturaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Detallefactura instance if not signed in', function(done) {
		// Set Detallefactura user 
		detallefactura.user = user;

		// Create new Detallefactura model instance
		var detallefacturaObj = new Detallefactura(detallefactura);

		// Save the Detallefactura
		detallefacturaObj.save(function() {
			// Try deleting Detallefactura
			request(app).delete('/detallefacturas/' + detallefacturaObj._id)
			.expect(401)
			.end(function(detallefacturaDeleteErr, detallefacturaDeleteRes) {
				// Set message assertion
				(detallefacturaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Detallefactura error error
				done(detallefacturaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Detallefactura.remove().exec();
		done();
	});
});