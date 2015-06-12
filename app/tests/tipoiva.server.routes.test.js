'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tipoiva = mongoose.model('Tipoiva'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tipoiva;

/**
 * Tipoiva routes tests
 */
describe('Tipoiva CRUD tests', function() {
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

		// Save a user to the test db and create new Tipoiva
		user.save(function() {
			tipoiva = {
				name: 'Tipoiva Name'
			};

			done();
		});
	});

	it('should be able to save Tipoiva instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipoiva
				agent.post('/tipoivas')
					.send(tipoiva)
					.expect(200)
					.end(function(tipoivaSaveErr, tipoivaSaveRes) {
						// Handle Tipoiva save error
						if (tipoivaSaveErr) done(tipoivaSaveErr);

						// Get a list of Tipoivas
						agent.get('/tipoivas')
							.end(function(tipoivasGetErr, tipoivasGetRes) {
								// Handle Tipoiva save error
								if (tipoivasGetErr) done(tipoivasGetErr);

								// Get Tipoivas list
								var tipoivas = tipoivasGetRes.body;

								// Set assertions
								(tipoivas[0].user._id).should.equal(userId);
								(tipoivas[0].name).should.match('Tipoiva Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tipoiva instance if not logged in', function(done) {
		agent.post('/tipoivas')
			.send(tipoiva)
			.expect(401)
			.end(function(tipoivaSaveErr, tipoivaSaveRes) {
				// Call the assertion callback
				done(tipoivaSaveErr);
			});
	});

	it('should not be able to save Tipoiva instance if no name is provided', function(done) {
		// Invalidate name field
		tipoiva.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipoiva
				agent.post('/tipoivas')
					.send(tipoiva)
					.expect(400)
					.end(function(tipoivaSaveErr, tipoivaSaveRes) {
						// Set message assertion
						(tipoivaSaveRes.body.message).should.match('Please fill Tipoiva name');
						
						// Handle Tipoiva save error
						done(tipoivaSaveErr);
					});
			});
	});

	it('should be able to update Tipoiva instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipoiva
				agent.post('/tipoivas')
					.send(tipoiva)
					.expect(200)
					.end(function(tipoivaSaveErr, tipoivaSaveRes) {
						// Handle Tipoiva save error
						if (tipoivaSaveErr) done(tipoivaSaveErr);

						// Update Tipoiva name
						tipoiva.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tipoiva
						agent.put('/tipoivas/' + tipoivaSaveRes.body._id)
							.send(tipoiva)
							.expect(200)
							.end(function(tipoivaUpdateErr, tipoivaUpdateRes) {
								// Handle Tipoiva update error
								if (tipoivaUpdateErr) done(tipoivaUpdateErr);

								// Set assertions
								(tipoivaUpdateRes.body._id).should.equal(tipoivaSaveRes.body._id);
								(tipoivaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tipoivas if not signed in', function(done) {
		// Create new Tipoiva model instance
		var tipoivaObj = new Tipoiva(tipoiva);

		// Save the Tipoiva
		tipoivaObj.save(function() {
			// Request Tipoivas
			request(app).get('/tipoivas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tipoiva if not signed in', function(done) {
		// Create new Tipoiva model instance
		var tipoivaObj = new Tipoiva(tipoiva);

		// Save the Tipoiva
		tipoivaObj.save(function() {
			request(app).get('/tipoivas/' + tipoivaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tipoiva.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tipoiva instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipoiva
				agent.post('/tipoivas')
					.send(tipoiva)
					.expect(200)
					.end(function(tipoivaSaveErr, tipoivaSaveRes) {
						// Handle Tipoiva save error
						if (tipoivaSaveErr) done(tipoivaSaveErr);

						// Delete existing Tipoiva
						agent.delete('/tipoivas/' + tipoivaSaveRes.body._id)
							.send(tipoiva)
							.expect(200)
							.end(function(tipoivaDeleteErr, tipoivaDeleteRes) {
								// Handle Tipoiva error error
								if (tipoivaDeleteErr) done(tipoivaDeleteErr);

								// Set assertions
								(tipoivaDeleteRes.body._id).should.equal(tipoivaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tipoiva instance if not signed in', function(done) {
		// Set Tipoiva user 
		tipoiva.user = user;

		// Create new Tipoiva model instance
		var tipoivaObj = new Tipoiva(tipoiva);

		// Save the Tipoiva
		tipoivaObj.save(function() {
			// Try deleting Tipoiva
			request(app).delete('/tipoivas/' + tipoivaObj._id)
			.expect(401)
			.end(function(tipoivaDeleteErr, tipoivaDeleteRes) {
				// Set message assertion
				(tipoivaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tipoiva error error
				done(tipoivaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tipoiva.remove().exec();
		done();
	});
});