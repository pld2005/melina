'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tipocomprobante = mongoose.model('Tipocomprobante'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tipocomprobante;

/**
 * Tipocomprobante routes tests
 */
describe('Tipocomprobante CRUD tests', function() {
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

		// Save a user to the test db and create new Tipocomprobante
		user.save(function() {
			tipocomprobante = {
				name: 'Tipocomprobante Name'
			};

			done();
		});
	});

	it('should be able to save Tipocomprobante instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipocomprobante
				agent.post('/tipocomprobantes')
					.send(tipocomprobante)
					.expect(200)
					.end(function(tipocomprobanteSaveErr, tipocomprobanteSaveRes) {
						// Handle Tipocomprobante save error
						if (tipocomprobanteSaveErr) done(tipocomprobanteSaveErr);

						// Get a list of Tipocomprobantes
						agent.get('/tipocomprobantes')
							.end(function(tipocomprobantesGetErr, tipocomprobantesGetRes) {
								// Handle Tipocomprobante save error
								if (tipocomprobantesGetErr) done(tipocomprobantesGetErr);

								// Get Tipocomprobantes list
								var tipocomprobantes = tipocomprobantesGetRes.body;

								// Set assertions
								(tipocomprobantes[0].user._id).should.equal(userId);
								(tipocomprobantes[0].name).should.match('Tipocomprobante Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tipocomprobante instance if not logged in', function(done) {
		agent.post('/tipocomprobantes')
			.send(tipocomprobante)
			.expect(401)
			.end(function(tipocomprobanteSaveErr, tipocomprobanteSaveRes) {
				// Call the assertion callback
				done(tipocomprobanteSaveErr);
			});
	});

	it('should not be able to save Tipocomprobante instance if no name is provided', function(done) {
		// Invalidate name field
		tipocomprobante.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipocomprobante
				agent.post('/tipocomprobantes')
					.send(tipocomprobante)
					.expect(400)
					.end(function(tipocomprobanteSaveErr, tipocomprobanteSaveRes) {
						// Set message assertion
						(tipocomprobanteSaveRes.body.message).should.match('Please fill Tipocomprobante name');
						
						// Handle Tipocomprobante save error
						done(tipocomprobanteSaveErr);
					});
			});
	});

	it('should be able to update Tipocomprobante instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipocomprobante
				agent.post('/tipocomprobantes')
					.send(tipocomprobante)
					.expect(200)
					.end(function(tipocomprobanteSaveErr, tipocomprobanteSaveRes) {
						// Handle Tipocomprobante save error
						if (tipocomprobanteSaveErr) done(tipocomprobanteSaveErr);

						// Update Tipocomprobante name
						tipocomprobante.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tipocomprobante
						agent.put('/tipocomprobantes/' + tipocomprobanteSaveRes.body._id)
							.send(tipocomprobante)
							.expect(200)
							.end(function(tipocomprobanteUpdateErr, tipocomprobanteUpdateRes) {
								// Handle Tipocomprobante update error
								if (tipocomprobanteUpdateErr) done(tipocomprobanteUpdateErr);

								// Set assertions
								(tipocomprobanteUpdateRes.body._id).should.equal(tipocomprobanteSaveRes.body._id);
								(tipocomprobanteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tipocomprobantes if not signed in', function(done) {
		// Create new Tipocomprobante model instance
		var tipocomprobanteObj = new Tipocomprobante(tipocomprobante);

		// Save the Tipocomprobante
		tipocomprobanteObj.save(function() {
			// Request Tipocomprobantes
			request(app).get('/tipocomprobantes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tipocomprobante if not signed in', function(done) {
		// Create new Tipocomprobante model instance
		var tipocomprobanteObj = new Tipocomprobante(tipocomprobante);

		// Save the Tipocomprobante
		tipocomprobanteObj.save(function() {
			request(app).get('/tipocomprobantes/' + tipocomprobanteObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tipocomprobante.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tipocomprobante instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipocomprobante
				agent.post('/tipocomprobantes')
					.send(tipocomprobante)
					.expect(200)
					.end(function(tipocomprobanteSaveErr, tipocomprobanteSaveRes) {
						// Handle Tipocomprobante save error
						if (tipocomprobanteSaveErr) done(tipocomprobanteSaveErr);

						// Delete existing Tipocomprobante
						agent.delete('/tipocomprobantes/' + tipocomprobanteSaveRes.body._id)
							.send(tipocomprobante)
							.expect(200)
							.end(function(tipocomprobanteDeleteErr, tipocomprobanteDeleteRes) {
								// Handle Tipocomprobante error error
								if (tipocomprobanteDeleteErr) done(tipocomprobanteDeleteErr);

								// Set assertions
								(tipocomprobanteDeleteRes.body._id).should.equal(tipocomprobanteSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tipocomprobante instance if not signed in', function(done) {
		// Set Tipocomprobante user 
		tipocomprobante.user = user;

		// Create new Tipocomprobante model instance
		var tipocomprobanteObj = new Tipocomprobante(tipocomprobante);

		// Save the Tipocomprobante
		tipocomprobanteObj.save(function() {
			// Try deleting Tipocomprobante
			request(app).delete('/tipocomprobantes/' + tipocomprobanteObj._id)
			.expect(401)
			.end(function(tipocomprobanteDeleteErr, tipocomprobanteDeleteRes) {
				// Set message assertion
				(tipocomprobanteDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tipocomprobante error error
				done(tipocomprobanteDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tipocomprobante.remove().exec();
		done();
	});
});