'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var facturas = require('../../app/controllers/facturas.server.controller');

	// Facturas Routes
	app.route('/facturas')
		.get(facturas.list)
		.post(users.requiresLogin, facturas.create);

	app.route('/facturas/:facturaId')
		.get(facturas.read)
		.put(users.requiresLogin, facturas.hasAuthorization, facturas.update)
		.delete(users.requiresLogin, facturas.hasAuthorization, facturas.delete);

	app.route('/nrofactura/:tipofactura')
    	.get(facturas.getNroFactura);

	// Finish by binding the Factura middleware
	app.param('facturaId', facturas.facturaByID);
};
