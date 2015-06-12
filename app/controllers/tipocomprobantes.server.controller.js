'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tipocomprobante = mongoose.model('Tipocomprobante'),
	_ = require('lodash');

/**
 * Create a Tipocomprobante
 */
exports.create = function(req, res) {
	var tipocomprobante = new Tipocomprobante(req.body);
	tipocomprobante.user = req.user;

	tipocomprobante.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipocomprobante);
		}
	});
};

/**
 * Show the current Tipocomprobante
 */
exports.read = function(req, res) {
	res.jsonp(req.tipocomprobante);
};

/**
 * Update a Tipocomprobante
 */
exports.update = function(req, res) {
	var tipocomprobante = req.tipocomprobante ;

	tipocomprobante = _.extend(tipocomprobante , req.body);

	tipocomprobante.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipocomprobante);
		}
	});
};

/**
 * Delete an Tipocomprobante
 */
exports.delete = function(req, res) {
	var tipocomprobante = req.tipocomprobante ;

	tipocomprobante.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipocomprobante);
		}
	});
};

/**
 * List of Tipocomprobantes
 */
exports.list = function(req, res) { 
	Tipocomprobante.find().sort('name').populate('user', 'displayName').exec(function(err, tipocomprobantes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipocomprobantes);
		}
	});
};

/**
 * Tipocomprobante middleware
 */
exports.tipocomprobanteByID = function(req, res, next, id) { 
	Tipocomprobante.findById(id).populate('user', 'displayName').exec(function(err, tipocomprobante) {
		if (err) return next(err);
		if (! tipocomprobante) return next(new Error('Failed to load Tipocomprobante ' + id));
		req.tipocomprobante = tipocomprobante ;
		next();
	});
};

/**
 * Tipocomprobante authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tipocomprobante.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
