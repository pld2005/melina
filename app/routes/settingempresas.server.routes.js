'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var settingempresas = require('../../app/controllers/settingempresas.server.controller');

	// Settingempresas Routes
	app.route('/settingempresas')
		.get(settingempresas.list)
		.post(users.requiresLogin, settingempresas.create);

	app.route('/settingempresas/:settingempresaId')
		.get(settingempresas.read)
		.put(users.requiresLogin, settingempresas.hasAuthorization, settingempresas.update)
		.delete(users.requiresLogin, settingempresas.hasAuthorization, settingempresas.delete);

	// Finish by binding the Settingempresa middleware
	app.param('settingempresaId', settingempresas.settingempresaByID);
};
