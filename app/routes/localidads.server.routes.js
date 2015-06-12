'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var localidads = require('../../app/controllers/localidads.server.controller');

	// Localidads Routes
	app.route('/localidads')
		.get(localidads.list)
		.post(users.requiresLogin, localidads.create);

	app.route('/localidads/:localidadId')
		.get(localidads.read)
		.put(users.requiresLogin, localidads.hasAuthorization, localidads.update)
		.delete(users.requiresLogin, localidads.hasAuthorization, localidads.delete);

	// Finish by binding the Localidad middleware
	app.param('localidadId', localidads.localidadByID);
};
