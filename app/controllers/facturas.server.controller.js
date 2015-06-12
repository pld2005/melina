'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Factura = mongoose.model('Factura'),
	_ = require('lodash');

/**
 * Create a Factura
 */
exports.create = function(req, res) {
	var factura = new Factura(req.body);
	factura.user = req.user;

	factura.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(factura);
		}
	});
};

/**
 * Show the current Factura
 */
exports.read = function(req, res) {
	res.jsonp(req.factura);
};

/**
 * Update a Factura
 */
exports.update = function(req, res) {
	var factura = req.factura ;

	factura = _.extend(factura , req.body);

	factura.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(factura);
		}
	});
};

/**
 * Delete an Factura
 */
exports.delete = function(req, res) {
	var factura = req.factura ;

	factura.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(factura);
		}
	});
};

/**
 * List of Facturas
 */
exports.list = function(req, res) { 
	Factura.find({'user': req.user}).sort('-created').populate('user', 'displayName').exec(function(err, facturas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(facturas);
		}
	});
};

/**
 * Factura middleware
 */
exports.facturaByID = function(req, res, next, id) { 
	Factura.findById(id).populate('user', 'displayName').exec(function(err, factura) {
		if (err) return next(err);
		if (! factura) return next(new Error('Failed to load Factura ' + id));
		req.factura = factura ;
		next();
	});
};

/**
 * Factura authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.factura.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


exports.getNroFactura = function(req, res) {
	Factura.find()
		.and([
    		{'user': req.user}, 
    		{tipoFac: req.params.tipofactura}
    	])
		.sort('-numero')
		.populate('user', 'displayName').exec(function(err, facturas) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(facturas);
			}
		});
};