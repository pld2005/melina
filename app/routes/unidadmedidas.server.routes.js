'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var unidadmedidas = require('../../app/controllers/unidadmedidas.server.controller');

	// Unidadmedidas Routes
	app.route('/unidadmedidas')
		.get(unidadmedidas.list)
		.post(users.requiresLogin, unidadmedidas.create);

	app.route('/unidadmedidas/:unidadmedidaId')
		.get(unidadmedidas.read)
		.put(users.requiresLogin, unidadmedidas.hasAuthorization, unidadmedidas.update)
		.delete(users.requiresLogin, unidadmedidas.hasAuthorization, unidadmedidas.delete);

	// Finish by binding the Unidadmedida middleware
	app.param('unidadmedidaId', unidadmedidas.unidadmedidaByID);
};
