'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Provincium = mongoose.model('Provincium'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, provincium;

/**
 * Provincium routes tests
 */
describe('Provincium CRUD tests', function() {
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

		// Save a user to the test db and create new Provincium
		user.save(function() {
			provincium = {
				name: 'Provincium Name'
			};

			done();
		});
	});

	it('should be able to save Provincium instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Provincium
				agent.post('/provincia')
					.send(provincium)
					.expect(200)
					.end(function(provinciumSaveErr, provinciumSaveRes) {
						// Handle Provincium save error
						if (provinciumSaveErr) done(provinciumSaveErr);

						// Get a list of Provincia
						agent.get('/provincia')
							.end(function(provinciaGetErr, provinciaGetRes) {
								// Handle Provincium save error
								if (provinciaGetErr) done(provinciaGetErr);

								// Get Provincia list
								var provincia = provinciaGetRes.body;

								// Set assertions
								(provincia[0].user._id).should.equal(userId);
								(provincia[0].name).should.match('Provincium Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Provincium instance if not logged in', function(done) {
		agent.post('/provincia')
			.send(provincium)
			.expect(401)
			.end(function(provinciumSaveErr, provinciumSaveRes) {
				// Call the assertion callback
				done(provinciumSaveErr);
			});
	});

	it('should not be able to save Provincium instance if no name is provided', function(done) {
		// Invalidate name field
		provincium.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Provincium
				agent.post('/provincia')
					.send(provincium)
					.expect(400)
					.end(function(provinciumSaveErr, provinciumSaveRes) {
						// Set message assertion
						(provinciumSaveRes.body.message).should.match('Please fill Provincium name');
						
						// Handle Provincium save error
						done(provinciumSaveErr);
					});
			});
	});

	it('should be able to update Provincium instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Provincium
				agent.post('/provincia')
					.send(provincium)
					.expect(200)
					.end(function(provinciumSaveErr, provinciumSaveRes) {
						// Handle Provincium save error
						if (provinciumSaveErr) done(provinciumSaveErr);

						// Update Provincium name
						provincium.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Provincium
						agent.put('/provincia/' + provinciumSaveRes.body._id)
							.send(provincium)
							.expect(200)
							.end(function(provinciumUpdateErr, provinciumUpdateRes) {
								// Handle Provincium update error
								if (provinciumUpdateErr) done(provinciumUpdateErr);

								// Set assertions
								(provinciumUpdateRes.body._id).should.equal(provinciumSaveRes.body._id);
								(provinciumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Provincia if not signed in', function(done) {
		// Create new Provincium model instance
		var provinciumObj = new Provincium(provincium);

		// Save the Provincium
		provinciumObj.save(function() {
			// Request Provincia
			request(app).get('/provincia')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Provincium if not signed in', function(done) {
		// Create new Provincium model instance
		var provinciumObj = new Provincium(provincium);

		// Save the Provincium
		provinciumObj.save(function() {
			request(app).get('/provincia/' + provinciumObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', provincium.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Provincium instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Provincium
				agent.post('/provincia')
					.send(provincium)
					.expect(200)
					.end(function(provinciumSaveErr, provinciumSaveRes) {
						// Handle Provincium save error
						if (provinciumSaveErr) done(provinciumSaveErr);

						// Delete existing Provincium
						agent.delete('/provincia/' + provinciumSaveRes.body._id)
							.send(provincium)
							.expect(200)
							.end(function(provinciumDeleteErr, provinciumDeleteRes) {
								// Handle Provincium error error
								if (provinciumDeleteErr) done(provinciumDeleteErr);

								// Set assertions
								(provinciumDeleteRes.body._id).should.equal(provinciumSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Provincium instance if not signed in', function(done) {
		// Set Provincium user 
		provincium.user = user;

		// Create new Provincium model instance
		var provinciumObj = new Provincium(provincium);

		// Save the Provincium
		provinciumObj.save(function() {
			// Try deleting Provincium
			request(app).delete('/provincia/' + provinciumObj._id)
			.expect(401)
			.end(function(provinciumDeleteErr, provinciumDeleteRes) {
				// Set message assertion
				(provinciumDeleteRes.body.message).should.match('User is not logged in');

				// Handle Provincium error error
				done(provinciumDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Provincium.remove().exec();
		done();
	});
});