'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var provincia = require('../../app/controllers/provincia.server.controller');

	// Provincia Routes
	app.route('/provincia')
		.get(provincia.list)
		.post(users.requiresLogin, provincia.create);

	app.route('/provincia/:provinciumId')
		.get(provincia.read)
		.put(users.requiresLogin, provincia.hasAuthorization, provincia.update)
		.delete(users.requiresLogin, provincia.hasAuthorization, provincia.delete);

	// Finish by binding the Provincium middleware
	app.param('provinciumId', provincia.provinciumByID);
};
