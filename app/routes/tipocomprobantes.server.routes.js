'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tipocomprobantes = require('../../app/controllers/tipocomprobantes.server.controller');

	// Tipocomprobantes Routes
	app.route('/tipocomprobantes')
		.get(tipocomprobantes.list)
		.post(users.requiresLogin, tipocomprobantes.create);

	app.route('/tipocomprobantes/:tipocomprobanteId')
		.get(tipocomprobantes.read)
		.put(users.requiresLogin, tipocomprobantes.hasAuthorization, tipocomprobantes.update)
		.delete(users.requiresLogin, tipocomprobantes.hasAuthorization, tipocomprobantes.delete);

	// Finish by binding the Tipocomprobante middleware
	app.param('tipocomprobanteId', tipocomprobantes.tipocomprobanteByID);
};
