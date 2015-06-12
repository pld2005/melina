'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tipoconceptos = require('../../app/controllers/tipoconceptos.server.controller');

	// Tipoconceptos Routes
	app.route('/tipoconceptos')
		.get(tipoconceptos.list)
		.post(users.requiresLogin, tipoconceptos.create);

	app.route('/tipoconceptos/:tipoconceptoId')
		.get(tipoconceptos.read)
		.put(users.requiresLogin, tipoconceptos.hasAuthorization, tipoconceptos.update)
		.delete(users.requiresLogin, tipoconceptos.hasAuthorization, tipoconceptos.delete);

	// Finish by binding the Tipoconcepto middleware
	app.param('tipoconceptoId', tipoconceptos.tipoconceptoByID);
};
