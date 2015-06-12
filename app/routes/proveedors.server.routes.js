'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var proveedors = require('../../app/controllers/proveedors.server.controller');

	// Proveedors Routes
	app.route('/proveedors')
		.get(proveedors.list)
		.post(users.requiresLogin, proveedors.create);

	app.route('/proveedors/:proveedorId')
		.get(proveedors.read)
		.put(users.requiresLogin, proveedors.hasAuthorization, proveedors.update)
		.delete(users.requiresLogin, proveedors.hasAuthorization, proveedors.delete);

	// Finish by binding the Proveedor middleware
	app.param('proveedorId', proveedors.proveedorByID);
};
