'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var detallefacturas = require('../../app/controllers/detallefacturas.server.controller');

	// Detallefacturas Routes
	app.route('/detallefacturas')
		.get(detallefacturas.list)
		.post(users.requiresLogin, detallefacturas.create);

	app.route('/detallefacturas/:detallefacturaId')
		.get(detallefacturas.read)
		.put(users.requiresLogin, detallefacturas.hasAuthorization, detallefacturas.update)
		.delete(users.requiresLogin, detallefacturas.hasAuthorization, detallefacturas.delete);

	// Finish by binding the Detallefactura middleware
	app.param('detallefacturaId', detallefacturas.detallefacturaByID);
};
