'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var departamentos = require('../../app/controllers/departamentos.server.controller');

	// Departamentos Routes
	app.route('/departamentos')
		.get(departamentos.list)
		.post(users.requiresLogin, departamentos.create);

	app.route('/departamentos/:departamentoId')
		.get(departamentos.read)
		.put(users.requiresLogin, departamentos.hasAuthorization, departamentos.update)
		.delete(users.requiresLogin, departamentos.hasAuthorization, departamentos.delete);

	app.route('/departamentos/provincia/:provincia')
    	.get(departamentos.DepartamentByProvincia);


	// Finish by binding the Departamento middleware
	app.param('departamentoId', departamentos.departamentoByID);
};
