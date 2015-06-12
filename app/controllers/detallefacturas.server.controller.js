'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Detallefactura = mongoose.model('Detallefactura'),
	_ = require('lodash');

/**
 * Create a Detallefactura
 */
exports.create = function(req, res) {
	var detallefactura = new Detallefactura(req.body);
	detallefactura.user = req.user;

	detallefactura.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(detallefactura);
		}
	});
};

/**
 * Show the current Detallefactura
 */
exports.read = function(req, res) {
	res.jsonp(req.detallefactura);
};

/**
 * Update a Detallefactura
 */
exports.update = function(req, res) {
	var detallefactura = req.detallefactura ;

	detallefactura = _.extend(detallefactura , req.body);

	detallefactura.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(detallefactura);
		}
	});
};

/**
 * Delete an Detallefactura
 */
exports.delete = function(req, res) {
	var detallefactura = req.detallefactura ;

	detallefactura.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(detallefactura);
		}
	});
};

/**
 * List of Detallefacturas
 */
exports.list = function(req, res) { 
	Detallefactura.find().sort('-created').populate('user', 'displayName').exec(function(err, detallefacturas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(detallefacturas);
		}
	});
};

/**
 * Detallefactura middleware
 */
exports.detallefacturaByID = function(req, res, next, id) { 
	Detallefactura.findById(id).populate('user', 'displayName').exec(function(err, detallefactura) {
		if (err) return next(err);
		if (! detallefactura) return next(new Error('Failed to load Detallefactura ' + id));
		req.detallefactura = detallefactura ;
		next();
	});
};

/**
 * Detallefactura authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.detallefactura.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
