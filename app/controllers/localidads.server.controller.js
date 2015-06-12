'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Localidad = mongoose.model('Localidad'),
	_ = require('lodash');

/**
 * Create a Localidad
 */
exports.create = function(req, res) {
	var localidad = new Localidad(req.body);
	localidad.user = req.user;

	localidad.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(localidad);
		}
	});
};

/**
 * Show the current Localidad
 */
exports.read = function(req, res) {
	res.jsonp(req.localidad);
};

/**
 * Update a Localidad
 */
exports.update = function(req, res) {
	var localidad = req.localidad ;

	localidad = _.extend(localidad , req.body);

	localidad.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(localidad);
		}
	});
};

/**
 * Delete an Localidad
 */
exports.delete = function(req, res) {
	var localidad = req.localidad ;

	localidad.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(localidad);
		}
	});
};

/**
 * List of Localidads
 */
exports.list = function(req, res) { 
	Localidad.find().sort('-created').populate('user', 'displayName').exec(function(err, localidads) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(localidads);
		}
	});
};

/**
 * Localidad middleware
 */
exports.localidadByID = function(req, res, next, id) { 
	Localidad.findById(id).populate('user', 'displayName').exec(function(err, localidad) {
		if (err) return next(err);
		if (! localidad) return next(new Error('Failed to load Localidad ' + id));
		req.localidad = localidad ;
		next();
	});
};

/**
 * Localidad authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.localidad.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
