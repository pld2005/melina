'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Departamento = mongoose.model('Departamento'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, departamento;

/**
 * Departamento routes tests
 */
describe('Departamento CRUD tests', function() {
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

		// Save a user to the test db and create new Departamento
		user.save(function() {
			departamento = {
				name: 'Departamento Name'
			};

			done();
		});
	});

	it('should be able to save Departamento instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Departamento
				agent.post('/departamentos')
					.send(departamento)
					.expect(200)
					.end(function(departamentoSaveErr, departamentoSaveRes) {
						// Handle Departamento save error
						if (departamentoSaveErr) done(departamentoSaveErr);

						// Get a list of Departamentos
						agent.get('/departamentos')
							.end(function(departamentosGetErr, departamentosGetRes) {
								// Handle Departamento save error
								if (departamentosGetErr) done(departamentosGetErr);

								// Get Departamentos list
								var departamentos = departamentosGetRes.body;

								// Set assertions
								(departamentos[0].user._id).should.equal(userId);
								(departamentos[0].name).should.match('Departamento Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Departamento instance if not logged in', function(done) {
		agent.post('/departamentos')
			.send(departamento)
			.expect(401)
			.end(function(departamentoSaveErr, departamentoSaveRes) {
				// Call the assertion callback
				done(departamentoSaveErr);
			});
	});

	it('should not be able to save Departamento instance if no name is provided', function(done) {
		// Invalidate name field
		departamento.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Departamento
				agent.post('/departamentos')
					.send(departamento)
					.expect(400)
					.end(function(departamentoSaveErr, departamentoSaveRes) {
						// Set message assertion
						(departamentoSaveRes.body.message).should.match('Please fill Departamento name');
						
						// Handle Departamento save error
						done(departamentoSaveErr);
					});
			});
	});

	it('should be able to update Departamento instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Departamento
				agent.post('/departamentos')
					.send(departamento)
					.expect(200)
					.end(function(departamentoSaveErr, departamentoSaveRes) {
						// Handle Departamento save error
						if (departamentoSaveErr) done(departamentoSaveErr);

						// Update Departamento name
						departamento.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Departamento
						agent.put('/departamentos/' + departamentoSaveRes.body._id)
							.send(departamento)
							.expect(200)
							.end(function(departamentoUpdateErr, departamentoUpdateRes) {
								// Handle Departamento update error
								if (departamentoUpdateErr) done(departamentoUpdateErr);

								// Set assertions
								(departamentoUpdateRes.body._id).should.equal(departamentoSaveRes.body._id);
								(departamentoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Departamentos if not signed in', function(done) {
		// Create new Departamento model instance
		var departamentoObj = new Departamento(departamento);

		// Save the Departamento
		departamentoObj.save(function() {
			// Request Departamentos
			request(app).get('/departamentos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Departamento if not signed in', function(done) {
		// Create new Departamento model instance
		var departamentoObj = new Departamento(departamento);

		// Save the Departamento
		departamentoObj.save(function() {
			request(app).get('/departamentos/' + departamentoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', departamento.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Departamento instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Departamento
				agent.post('/departamentos')
					.send(departamento)
					.expect(200)
					.end(function(departamentoSaveErr, departamentoSaveRes) {
						// Handle Departamento save error
						if (departamentoSaveErr) done(departamentoSaveErr);

						// Delete existing Departamento
						agent.delete('/departamentos/' + departamentoSaveRes.body._id)
							.send(departamento)
							.expect(200)
							.end(function(departamentoDeleteErr, departamentoDeleteRes) {
								// Handle Departamento error error
								if (departamentoDeleteErr) done(departamentoDeleteErr);

								// Set assertions
								(departamentoDeleteRes.body._id).should.equal(departamentoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Departamento instance if not signed in', function(done) {
		// Set Departamento user 
		departamento.user = user;

		// Create new Departamento model instance
		var departamentoObj = new Departamento(departamento);

		// Save the Departamento
		departamentoObj.save(function() {
			// Try deleting Departamento
			request(app).delete('/departamentos/' + departamentoObj._id)
			.expect(401)
			.end(function(departamentoDeleteErr, departamentoDeleteRes) {
				// Set message assertion
				(departamentoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Departamento error error
				done(departamentoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Departamento.remove().exec();
		done();
	});
});