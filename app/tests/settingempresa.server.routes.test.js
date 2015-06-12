'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Settingempresa = mongoose.model('Settingempresa'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, settingempresa;

/**
 * Settingempresa routes tests
 */
describe('Settingempresa CRUD tests', function() {
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

		// Save a user to the test db and create new Settingempresa
		user.save(function() {
			settingempresa = {
				name: 'Settingempresa Name'
			};

			done();
		});
	});

	it('should be able to save Settingempresa instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Settingempresa
				agent.post('/settingempresas')
					.send(settingempresa)
					.expect(200)
					.end(function(settingempresaSaveErr, settingempresaSaveRes) {
						// Handle Settingempresa save error
						if (settingempresaSaveErr) done(settingempresaSaveErr);

						// Get a list of Settingempresas
						agent.get('/settingempresas')
							.end(function(settingempresasGetErr, settingempresasGetRes) {
								// Handle Settingempresa save error
								if (settingempresasGetErr) done(settingempresasGetErr);

								// Get Settingempresas list
								var settingempresas = settingempresasGetRes.body;

								// Set assertions
								(settingempresas[0].user._id).should.equal(userId);
								(settingempresas[0].name).should.match('Settingempresa Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Settingempresa instance if not logged in', function(done) {
		agent.post('/settingempresas')
			.send(settingempresa)
			.expect(401)
			.end(function(settingempresaSaveErr, settingempresaSaveRes) {
				// Call the assertion callback
				done(settingempresaSaveErr);
			});
	});

	it('should not be able to save Settingempresa instance if no name is provided', function(done) {
		// Invalidate name field
		settingempresa.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Settingempresa
				agent.post('/settingempresas')
					.send(settingempresa)
					.expect(400)
					.end(function(settingempresaSaveErr, settingempresaSaveRes) {
						// Set message assertion
						(settingempresaSaveRes.body.message).should.match('Please fill Settingempresa name');
						
						// Handle Settingempresa save error
						done(settingempresaSaveErr);
					});
			});
	});

	it('should be able to update Settingempresa instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Settingempresa
				agent.post('/settingempresas')
					.send(settingempresa)
					.expect(200)
					.end(function(settingempresaSaveErr, settingempresaSaveRes) {
						// Handle Settingempresa save error
						if (settingempresaSaveErr) done(settingempresaSaveErr);

						// Update Settingempresa name
						settingempresa.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Settingempresa
						agent.put('/settingempresas/' + settingempresaSaveRes.body._id)
							.send(settingempresa)
							.expect(200)
							.end(function(settingempresaUpdateErr, settingempresaUpdateRes) {
								// Handle Settingempresa update error
								if (settingempresaUpdateErr) done(settingempresaUpdateErr);

								// Set assertions
								(settingempresaUpdateRes.body._id).should.equal(settingempresaSaveRes.body._id);
								(settingempresaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Settingempresas if not signed in', function(done) {
		// Create new Settingempresa model instance
		var settingempresaObj = new Settingempresa(settingempresa);

		// Save the Settingempresa
		settingempresaObj.save(function() {
			// Request Settingempresas
			request(app).get('/settingempresas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Settingempresa if not signed in', function(done) {
		// Create new Settingempresa model instance
		var settingempresaObj = new Settingempresa(settingempresa);

		// Save the Settingempresa
		settingempresaObj.save(function() {
			request(app).get('/settingempresas/' + settingempresaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', settingempresa.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Settingempresa instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Settingempresa
				agent.post('/settingempresas')
					.send(settingempresa)
					.expect(200)
					.end(function(settingempresaSaveErr, settingempresaSaveRes) {
						// Handle Settingempresa save error
						if (settingempresaSaveErr) done(settingempresaSaveErr);

						// Delete existing Settingempresa
						agent.delete('/settingempresas/' + settingempresaSaveRes.body._id)
							.send(settingempresa)
							.expect(200)
							.end(function(settingempresaDeleteErr, settingempresaDeleteRes) {
								// Handle Settingempresa error error
								if (settingempresaDeleteErr) done(settingempresaDeleteErr);

								// Set assertions
								(settingempresaDeleteRes.body._id).should.equal(settingempresaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Settingempresa instance if not signed in', function(done) {
		// Set Settingempresa user 
		settingempresa.user = user;

		// Create new Settingempresa model instance
		var settingempresaObj = new Settingempresa(settingempresa);

		// Save the Settingempresa
		settingempresaObj.save(function() {
			// Try deleting Settingempresa
			request(app).delete('/settingempresas/' + settingempresaObj._id)
			.expect(401)
			.end(function(settingempresaDeleteErr, settingempresaDeleteRes) {
				// Set message assertion
				(settingempresaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Settingempresa error error
				done(settingempresaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Settingempresa.remove().exec();
		done();
	});
});