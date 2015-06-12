'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Condicioniva = mongoose.model('Condicioniva'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, condicioniva;

/**
 * Condicioniva routes tests
 */
describe('Condicioniva CRUD tests', function() {
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

		// Save a user to the test db and create new Condicioniva
		user.save(function() {
			condicioniva = {
				name: 'Condicioniva Name'
			};

			done();
		});
	});

	it('should be able to save Condicioniva instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Condicioniva
				agent.post('/condicionivas')
					.send(condicioniva)
					.expect(200)
					.end(function(condicionivaSaveErr, condicionivaSaveRes) {
						// Handle Condicioniva save error
						if (condicionivaSaveErr) done(condicionivaSaveErr);

						// Get a list of Condicionivas
						agent.get('/condicionivas')
							.end(function(condicionivasGetErr, condicionivasGetRes) {
								// Handle Condicioniva save error
								if (condicionivasGetErr) done(condicionivasGetErr);

								// Get Condicionivas list
								var condicionivas = condicionivasGetRes.body;

								// Set assertions
								(condicionivas[0].user._id).should.equal(userId);
								(condicionivas[0].name).should.match('Condicioniva Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Condicioniva instance if not logged in', function(done) {
		agent.post('/condicionivas')
			.send(condicioniva)
			.expect(401)
			.end(function(condicionivaSaveErr, condicionivaSaveRes) {
				// Call the assertion callback
				done(condicionivaSaveErr);
			});
	});

	it('should not be able to save Condicioniva instance if no name is provided', function(done) {
		// Invalidate name field
		condicioniva.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Condicioniva
				agent.post('/condicionivas')
					.send(condicioniva)
					.expect(400)
					.end(function(condicionivaSaveErr, condicionivaSaveRes) {
						// Set message assertion
						(condicionivaSaveRes.body.message).should.match('Please fill Condicioniva name');
						
						// Handle Condicioniva save error
						done(condicionivaSaveErr);
					});
			});
	});

	it('should be able to update Condicioniva instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Condicioniva
				agent.post('/condicionivas')
					.send(condicioniva)
					.expect(200)
					.end(function(condicionivaSaveErr, condicionivaSaveRes) {
						// Handle Condicioniva save error
						if (condicionivaSaveErr) done(condicionivaSaveErr);

						// Update Condicioniva name
						condicioniva.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Condicioniva
						agent.put('/condicionivas/' + condicionivaSaveRes.body._id)
							.send(condicioniva)
							.expect(200)
							.end(function(condicionivaUpdateErr, condicionivaUpdateRes) {
								// Handle Condicioniva update error
								if (condicionivaUpdateErr) done(condicionivaUpdateErr);

								// Set assertions
								(condicionivaUpdateRes.body._id).should.equal(condicionivaSaveRes.body._id);
								(condicionivaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Condicionivas if not signed in', function(done) {
		// Create new Condicioniva model instance
		var condicionivaObj = new Condicioniva(condicioniva);

		// Save the Condicioniva
		condicionivaObj.save(function() {
			// Request Condicionivas
			request(app).get('/condicionivas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Condicioniva if not signed in', function(done) {
		// Create new Condicioniva model instance
		var condicionivaObj = new Condicioniva(condicioniva);

		// Save the Condicioniva
		condicionivaObj.save(function() {
			request(app).get('/condicionivas/' + condicionivaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', condicioniva.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Condicioniva instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Condicioniva
				agent.post('/condicionivas')
					.send(condicioniva)
					.expect(200)
					.end(function(condicionivaSaveErr, condicionivaSaveRes) {
						// Handle Condicioniva save error
						if (condicionivaSaveErr) done(condicionivaSaveErr);

						// Delete existing Condicioniva
						agent.delete('/condicionivas/' + condicionivaSaveRes.body._id)
							.send(condicioniva)
							.expect(200)
							.end(function(condicionivaDeleteErr, condicionivaDeleteRes) {
								// Handle Condicioniva error error
								if (condicionivaDeleteErr) done(condicionivaDeleteErr);

								// Set assertions
								(condicionivaDeleteRes.body._id).should.equal(condicionivaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Condicioniva instance if not signed in', function(done) {
		// Set Condicioniva user 
		condicioniva.user = user;

		// Create new Condicioniva model instance
		var condicionivaObj = new Condicioniva(condicioniva);

		// Save the Condicioniva
		condicionivaObj.save(function() {
			// Try deleting Condicioniva
			request(app).delete('/condicionivas/' + condicionivaObj._id)
			.expect(401)
			.end(function(condicionivaDeleteErr, condicionivaDeleteRes) {
				// Set message assertion
				(condicionivaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Condicioniva error error
				done(condicionivaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Condicioniva.remove().exec();
		done();
	});
});