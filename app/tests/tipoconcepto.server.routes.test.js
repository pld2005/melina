'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tipoconcepto = mongoose.model('Tipoconcepto'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tipoconcepto;

/**
 * Tipoconcepto routes tests
 */
describe('Tipoconcepto CRUD tests', function() {
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

		// Save a user to the test db and create new Tipoconcepto
		user.save(function() {
			tipoconcepto = {
				name: 'Tipoconcepto Name'
			};

			done();
		});
	});

	it('should be able to save Tipoconcepto instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipoconcepto
				agent.post('/tipoconceptos')
					.send(tipoconcepto)
					.expect(200)
					.end(function(tipoconceptoSaveErr, tipoconceptoSaveRes) {
						// Handle Tipoconcepto save error
						if (tipoconceptoSaveErr) done(tipoconceptoSaveErr);

						// Get a list of Tipoconceptos
						agent.get('/tipoconceptos')
							.end(function(tipoconceptosGetErr, tipoconceptosGetRes) {
								// Handle Tipoconcepto save error
								if (tipoconceptosGetErr) done(tipoconceptosGetErr);

								// Get Tipoconceptos list
								var tipoconceptos = tipoconceptosGetRes.body;

								// Set assertions
								(tipoconceptos[0].user._id).should.equal(userId);
								(tipoconceptos[0].name).should.match('Tipoconcepto Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tipoconcepto instance if not logged in', function(done) {
		agent.post('/tipoconceptos')
			.send(tipoconcepto)
			.expect(401)
			.end(function(tipoconceptoSaveErr, tipoconceptoSaveRes) {
				// Call the assertion callback
				done(tipoconceptoSaveErr);
			});
	});

	it('should not be able to save Tipoconcepto instance if no name is provided', function(done) {
		// Invalidate name field
		tipoconcepto.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipoconcepto
				agent.post('/tipoconceptos')
					.send(tipoconcepto)
					.expect(400)
					.end(function(tipoconceptoSaveErr, tipoconceptoSaveRes) {
						// Set message assertion
						(tipoconceptoSaveRes.body.message).should.match('Please fill Tipoconcepto name');
						
						// Handle Tipoconcepto save error
						done(tipoconceptoSaveErr);
					});
			});
	});

	it('should be able to update Tipoconcepto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipoconcepto
				agent.post('/tipoconceptos')
					.send(tipoconcepto)
					.expect(200)
					.end(function(tipoconceptoSaveErr, tipoconceptoSaveRes) {
						// Handle Tipoconcepto save error
						if (tipoconceptoSaveErr) done(tipoconceptoSaveErr);

						// Update Tipoconcepto name
						tipoconcepto.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tipoconcepto
						agent.put('/tipoconceptos/' + tipoconceptoSaveRes.body._id)
							.send(tipoconcepto)
							.expect(200)
							.end(function(tipoconceptoUpdateErr, tipoconceptoUpdateRes) {
								// Handle Tipoconcepto update error
								if (tipoconceptoUpdateErr) done(tipoconceptoUpdateErr);

								// Set assertions
								(tipoconceptoUpdateRes.body._id).should.equal(tipoconceptoSaveRes.body._id);
								(tipoconceptoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tipoconceptos if not signed in', function(done) {
		// Create new Tipoconcepto model instance
		var tipoconceptoObj = new Tipoconcepto(tipoconcepto);

		// Save the Tipoconcepto
		tipoconceptoObj.save(function() {
			// Request Tipoconceptos
			request(app).get('/tipoconceptos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tipoconcepto if not signed in', function(done) {
		// Create new Tipoconcepto model instance
		var tipoconceptoObj = new Tipoconcepto(tipoconcepto);

		// Save the Tipoconcepto
		tipoconceptoObj.save(function() {
			request(app).get('/tipoconceptos/' + tipoconceptoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tipoconcepto.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tipoconcepto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipoconcepto
				agent.post('/tipoconceptos')
					.send(tipoconcepto)
					.expect(200)
					.end(function(tipoconceptoSaveErr, tipoconceptoSaveRes) {
						// Handle Tipoconcepto save error
						if (tipoconceptoSaveErr) done(tipoconceptoSaveErr);

						// Delete existing Tipoconcepto
						agent.delete('/tipoconceptos/' + tipoconceptoSaveRes.body._id)
							.send(tipoconcepto)
							.expect(200)
							.end(function(tipoconceptoDeleteErr, tipoconceptoDeleteRes) {
								// Handle Tipoconcepto error error
								if (tipoconceptoDeleteErr) done(tipoconceptoDeleteErr);

								// Set assertions
								(tipoconceptoDeleteRes.body._id).should.equal(tipoconceptoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tipoconcepto instance if not signed in', function(done) {
		// Set Tipoconcepto user 
		tipoconcepto.user = user;

		// Create new Tipoconcepto model instance
		var tipoconceptoObj = new Tipoconcepto(tipoconcepto);

		// Save the Tipoconcepto
		tipoconceptoObj.save(function() {
			// Try deleting Tipoconcepto
			request(app).delete('/tipoconceptos/' + tipoconceptoObj._id)
			.expect(401)
			.end(function(tipoconceptoDeleteErr, tipoconceptoDeleteRes) {
				// Set message assertion
				(tipoconceptoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tipoconcepto error error
				done(tipoconceptoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tipoconcepto.remove().exec();
		done();
	});
});