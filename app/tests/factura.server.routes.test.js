'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Factura = mongoose.model('Factura'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, factura;

/**
 * Factura routes tests
 */
describe('Factura CRUD tests', function() {
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

		// Save a user to the test db and create new Factura
		user.save(function() {
			factura = {
				name: 'Factura Name'
			};

			done();
		});
	});

	it('should be able to save Factura instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Factura
				agent.post('/facturas')
					.send(factura)
					.expect(200)
					.end(function(facturaSaveErr, facturaSaveRes) {
						// Handle Factura save error
						if (facturaSaveErr) done(facturaSaveErr);

						// Get a list of Facturas
						agent.get('/facturas')
							.end(function(facturasGetErr, facturasGetRes) {
								// Handle Factura save error
								if (facturasGetErr) done(facturasGetErr);

								// Get Facturas list
								var facturas = facturasGetRes.body;

								// Set assertions
								(facturas[0].user._id).should.equal(userId);
								(facturas[0].name).should.match('Factura Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Factura instance if not logged in', function(done) {
		agent.post('/facturas')
			.send(factura)
			.expect(401)
			.end(function(facturaSaveErr, facturaSaveRes) {
				// Call the assertion callback
				done(facturaSaveErr);
			});
	});

	it('should not be able to save Factura instance if no name is provided', function(done) {
		// Invalidate name field
		factura.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Factura
				agent.post('/facturas')
					.send(factura)
					.expect(400)
					.end(function(facturaSaveErr, facturaSaveRes) {
						// Set message assertion
						(facturaSaveRes.body.message).should.match('Please fill Factura name');
						
						// Handle Factura save error
						done(facturaSaveErr);
					});
			});
	});

	it('should be able to update Factura instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Factura
				agent.post('/facturas')
					.send(factura)
					.expect(200)
					.end(function(facturaSaveErr, facturaSaveRes) {
						// Handle Factura save error
						if (facturaSaveErr) done(facturaSaveErr);

						// Update Factura name
						factura.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Factura
						agent.put('/facturas/' + facturaSaveRes.body._id)
							.send(factura)
							.expect(200)
							.end(function(facturaUpdateErr, facturaUpdateRes) {
								// Handle Factura update error
								if (facturaUpdateErr) done(facturaUpdateErr);

								// Set assertions
								(facturaUpdateRes.body._id).should.equal(facturaSaveRes.body._id);
								(facturaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Facturas if not signed in', function(done) {
		// Create new Factura model instance
		var facturaObj = new Factura(factura);

		// Save the Factura
		facturaObj.save(function() {
			// Request Facturas
			request(app).get('/facturas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Factura if not signed in', function(done) {
		// Create new Factura model instance
		var facturaObj = new Factura(factura);

		// Save the Factura
		facturaObj.save(function() {
			request(app).get('/facturas/' + facturaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', factura.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Factura instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Factura
				agent.post('/facturas')
					.send(factura)
					.expect(200)
					.end(function(facturaSaveErr, facturaSaveRes) {
						// Handle Factura save error
						if (facturaSaveErr) done(facturaSaveErr);

						// Delete existing Factura
						agent.delete('/facturas/' + facturaSaveRes.body._id)
							.send(factura)
							.expect(200)
							.end(function(facturaDeleteErr, facturaDeleteRes) {
								// Handle Factura error error
								if (facturaDeleteErr) done(facturaDeleteErr);

								// Set assertions
								(facturaDeleteRes.body._id).should.equal(facturaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Factura instance if not signed in', function(done) {
		// Set Factura user 
		factura.user = user;

		// Create new Factura model instance
		var facturaObj = new Factura(factura);

		// Save the Factura
		facturaObj.save(function() {
			// Try deleting Factura
			request(app).delete('/facturas/' + facturaObj._id)
			.expect(401)
			.end(function(facturaDeleteErr, facturaDeleteRes) {
				// Set message assertion
				(facturaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Factura error error
				done(facturaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Factura.remove().exec();
		done();
	});
});