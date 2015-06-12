'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var condicionivas = require('../../app/controllers/condicionivas.server.controller');

	// Condicionivas Routes
	app.route('/condicionivas')
		.get(condicionivas.list)
		.post(users.requiresLogin, condicionivas.create);

	app.route('/condicionivas/:condicionivaId')
		.get(condicionivas.read)
		.put(users.requiresLogin, condicionivas.hasAuthorization, condicionivas.update)
		.delete(users.requiresLogin, condicionivas.hasAuthorization, condicionivas.delete);

	// Finish by binding the Condicioniva middleware
	app.param('condicionivaId', condicionivas.condicionivaByID);
};
