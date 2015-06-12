'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var clientes = require('../../app/controllers/clientes.server.controller');

	// Clientes Routes
	app.route('/clientes')
		.get(clientes.list)
		.post(users.requiresLogin, clientes.create);

	app.route('/clientes/:clienteId')
		.get(clientes.read)
		.put(users.requiresLogin, clientes.hasAuthorization, clientes.update)
		.delete(users.requiresLogin, clientes.hasAuthorization, clientes.delete);

	app.route('/combocliente/')
		.get(clientes.combocliente);
		
	// Finish by binding the Cliente middleware
	app.param('clienteId', clientes.clienteByID);
};
