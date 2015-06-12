'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tipoiva = mongoose.model('Tipoiva'),
	_ = require('lodash');

/**
 * Create a Tipoiva
 */
exports.create = function(req, res) {
	var tipoiva = new Tipoiva(req.body);
	tipoiva.user = req.user;

	tipoiva.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipoiva);
		}
	});
};

/**
 * Show the current Tipoiva
 */
exports.read = function(req, res) {
	res.jsonp(req.tipoiva);
};

/**
 * Update a Tipoiva
 */
exports.update = function(req, res) {
	var tipoiva = req.tipoiva ;

	tipoiva = _.extend(tipoiva , req.body);

	tipoiva.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipoiva);
		}
	});
};

/**
 * Delete an Tipoiva
 */
exports.delete = function(req, res) {
	var tipoiva = req.tipoiva ;

	tipoiva.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipoiva);
		}
	});
};

/**
 * List of Tipoivas
 */
exports.list = function(req, res) { 
	Tipoiva.find().sort('-created').populate('user', 'displayName').exec(function(err, tipoivas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipoivas);
		}
	});
};

/**
 * Tipoiva middleware
 */
exports.tipoivaByID = function(req, res, next, id) { 
	Tipoiva.findById(id).populate('user', 'displayName').exec(function(err, tipoiva) {
		if (err) return next(err);
		if (! tipoiva) return next(new Error('Failed to load Tipoiva ' + id));
		req.tipoiva = tipoiva ;
		next();
	});
};

/**
 * Tipoiva authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tipoiva.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
