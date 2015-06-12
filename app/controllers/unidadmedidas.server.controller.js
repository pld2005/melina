'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Unidadmedida = mongoose.model('Unidadmedida'),
	_ = require('lodash');

/**
 * Create a Unidadmedida
 */
exports.create = function(req, res) {
	var unidadmedida = new Unidadmedida(req.body);
	unidadmedida.user = req.user;

	unidadmedida.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(unidadmedida);
		}
	});
};

/**
 * Show the current Unidadmedida
 */
exports.read = function(req, res) {
	res.jsonp(req.unidadmedida);
};

/**
 * Update a Unidadmedida
 */
exports.update = function(req, res) {
	var unidadmedida = req.unidadmedida ;

	unidadmedida = _.extend(unidadmedida , req.body);

	unidadmedida.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(unidadmedida);
		}
	});
};

/**
 * Delete an Unidadmedida
 */
exports.delete = function(req, res) {
	var unidadmedida = req.unidadmedida ;

	unidadmedida.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(unidadmedida);
		}
	});
};

/**
 * List of Unidadmedidas
 */
exports.list = function(req, res) { 
	Unidadmedida.find().sort('name').populate('user', 'displayName').exec(function(err, unidadmedidas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(unidadmedidas);
		}
	});
};

/**
 * Unidadmedida middleware
 */
exports.unidadmedidaByID = function(req, res, next, id) { 
	Unidadmedida.findById(id).populate('user', 'displayName').exec(function(err, unidadmedida) {
		if (err) return next(err);
		if (! unidadmedida) return next(new Error('Failed to load Unidadmedida ' + id));
		req.unidadmedida = unidadmedida ;
		next();
	});
};

/**
 * Unidadmedida authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.unidadmedida.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
