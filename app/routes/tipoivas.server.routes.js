'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tipoivas = require('../../app/controllers/tipoivas.server.controller');

	// Tipoivas Routes
	app.route('/tipoivas')
		.get(tipoivas.list)
		.post(users.requiresLogin, tipoivas.create);

	app.route('/tipoivas/:tipoivaId')
		.get(tipoivas.read)
		.put(users.requiresLogin, tipoivas.hasAuthorization, tipoivas.update)
		.delete(users.requiresLogin, tipoivas.hasAuthorization, tipoivas.delete);

	// Finish by binding the Tipoiva middleware
	app.param('tipoivaId', tipoivas.tipoivaByID);
};
