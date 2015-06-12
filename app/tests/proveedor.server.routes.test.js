'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Proveedor = mongoose.model('Proveedor'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, proveedor;

/**
 * Proveedor routes tests
 */
describe('Proveedor CRUD tests', function() {
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

		// Save a user to the test db and create new Proveedor
		user.save(function() {
			proveedor = {
				name: 'Proveedor Name'
			};

			done();
		});
	});

	it('should be able to save Proveedor instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Proveedor
				agent.post('/proveedors')
					.send(proveedor)
					.expect(200)
					.end(function(proveedorSaveErr, proveedorSaveRes) {
						// Handle Proveedor save error
						if (proveedorSaveErr) done(proveedorSaveErr);

						// Get a list of Proveedors
						agent.get('/proveedors')
							.end(function(proveedorsGetErr, proveedorsGetRes) {
								// Handle Proveedor save error
								if (proveedorsGetErr) done(proveedorsGetErr);

								// Get Proveedors list
								var proveedors = proveedorsGetRes.body;

								// Set assertions
								(proveedors[0].user._id).should.equal(userId);
								(proveedors[0].name).should.match('Proveedor Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Proveedor instance if not logged in', function(done) {
		agent.post('/proveedors')
			.send(proveedor)
			.expect(401)
			.end(function(proveedorSaveErr, proveedorSaveRes) {
				// Call the assertion callback
				done(proveedorSaveErr);
			});
	});

	it('should not be able to save Proveedor instance if no name is provided', function(done) {
		// Invalidate name field
		proveedor.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Proveedor
				agent.post('/proveedors')
					.send(proveedor)
					.expect(400)
					.end(function(proveedorSaveErr, proveedorSaveRes) {
						// Set message assertion
						(proveedorSaveRes.body.message).should.match('Please fill Proveedor name');
						
						// Handle Proveedor save error
						done(proveedorSaveErr);
					});
			});
	});

	it('should be able to update Proveedor instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Proveedor
				agent.post('/proveedors')
					.send(proveedor)
					.expect(200)
					.end(function(proveedorSaveErr, proveedorSaveRes) {
						// Handle Proveedor save error
						if (proveedorSaveErr) done(proveedorSaveErr);

						// Update Proveedor name
						proveedor.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Proveedor
						agent.put('/proveedors/' + proveedorSaveRes.body._id)
							.send(proveedor)
							.expect(200)
							.end(function(proveedorUpdateErr, proveedorUpdateRes) {
								// Handle Proveedor update error
								if (proveedorUpdateErr) done(proveedorUpdateErr);

								// Set assertions
								(proveedorUpdateRes.body._id).should.equal(proveedorSaveRes.body._id);
								(proveedorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Proveedors if not signed in', function(done) {
		// Create new Proveedor model instance
		var proveedorObj = new Proveedor(proveedor);

		// Save the Proveedor
		proveedorObj.save(function() {
			// Request Proveedors
			request(app).get('/proveedors')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Proveedor if not signed in', function(done) {
		// Create new Proveedor model instance
		var proveedorObj = new Proveedor(proveedor);

		// Save the Proveedor
		proveedorObj.save(function() {
			request(app).get('/proveedors/' + proveedorObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', proveedor.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Proveedor instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Proveedor
				agent.post('/proveedors')
					.send(proveedor)
					.expect(200)
					.end(function(proveedorSaveErr, proveedorSaveRes) {
						// Handle Proveedor save error
						if (proveedorSaveErr) done(proveedorSaveErr);

						// Delete existing Proveedor
						agent.delete('/proveedors/' + proveedorSaveRes.body._id)
							.send(proveedor)
							.expect(200)
							.end(function(proveedorDeleteErr, proveedorDeleteRes) {
								// Handle Proveedor error error
								if (proveedorDeleteErr) done(proveedorDeleteErr);

								// Set assertions
								(proveedorDeleteRes.body._id).should.equal(proveedorSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Proveedor instance if not signed in', function(done) {
		// Set Proveedor user 
		proveedor.user = user;

		// Create new Proveedor model instance
		var proveedorObj = new Proveedor(proveedor);

		// Save the Proveedor
		proveedorObj.save(function() {
			// Try deleting Proveedor
			request(app).delete('/proveedors/' + proveedorObj._id)
			.expect(401)
			.end(function(proveedorDeleteErr, proveedorDeleteRes) {
				// Set message assertion
				(proveedorDeleteRes.body.message).should.match('User is not logged in');

				// Handle Proveedor error error
				done(proveedorDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Proveedor.remove().exec();
		done();
	});
});