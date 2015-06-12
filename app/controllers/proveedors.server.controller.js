'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Proveedor = mongoose.model('Proveedor'),
	_ = require('lodash');

/**
 * Create a Proveedor
 */
exports.create = function(req, res) {
	var proveedor = new Proveedor(req.body);
	proveedor.user = req.user;

	proveedor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proveedor);
		}
	});
};

/**
 * Show the current Proveedor
 */
exports.read = function(req, res) {
	res.jsonp(req.proveedor);
};

/**
 * Update a Proveedor
 */
exports.update = function(req, res) {
	var proveedor = req.proveedor ;

	proveedor = _.extend(proveedor , req.body);

	proveedor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proveedor);
		}
	});
};

/**
 * Delete an Proveedor
 */
exports.delete = function(req, res) {
	var proveedor = req.proveedor ;

	proveedor.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proveedor);
		}
	});
};

/**
 * List of Proveedors
 */
exports.list = function(req, res) { 
	Proveedor.find({'user': req.user}).sort('-created').populate('user', 'displayName').exec(function(err, proveedors) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proveedors);
		}
	});
};

/**
 * Proveedor middleware
 */
exports.proveedorByID = function(req, res, next, id) { 
	Proveedor.findById(id).populate('user', 'displayName').exec(function(err, proveedor) {
		if (err) return next(err);
		if (! proveedor) return next(new Error('Failed to load Proveedor ' + id));
		req.proveedor = proveedor ;
		next();
	});
};

/**
 * Proveedor authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.proveedor.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
