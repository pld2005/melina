'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Condicioniva = mongoose.model('Condicioniva'),
	_ = require('lodash');

/**
 * Create a Condicioniva
 */
exports.create = function(req, res) {
	var condicioniva = new Condicioniva(req.body);
	condicioniva.user = req.user;

	condicioniva.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(condicioniva);
		}
	});
};

/**
 * Show the current Condicioniva
 */
exports.read = function(req, res) {
	res.jsonp(req.condicioniva);
};

/**
 * Update a Condicioniva
 */
exports.update = function(req, res) {
	var condicioniva = req.condicioniva ;

	condicioniva = _.extend(condicioniva , req.body);

	condicioniva.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(condicioniva);
		}
	});
};

/**
 * Delete an Condicioniva
 */
exports.delete = function(req, res) {
	var condicioniva = req.condicioniva ;

	condicioniva.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(condicioniva);
		}
	});
};

/**
 * List of Condicionivas
 */
exports.list = function(req, res) { 
	Condicioniva.find().sort('idafip').populate('user', 'displayName').exec(function(err, condicionivas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(condicionivas);
		}
	});
};

/**
 * Condicioniva middleware
 */
exports.condicionivaByID = function(req, res, next, id) { 
	Condicioniva.findById(id).populate('user', 'displayName').exec(function(err, condicioniva) {
		if (err) return next(err);
		if (! condicioniva) return next(new Error('Failed to load Condicioniva ' + id));
		req.condicioniva = condicioniva ;
		next();
	});
};

/**
 * Condicioniva authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.condicioniva.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
