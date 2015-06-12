'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Provincium = mongoose.model('Provincium'),
	_ = require('lodash');

/**
 * Create a Provincium
 */
exports.create = function(req, res) {
	var provincium = new Provincium(req.body);
	provincium.user = req.user;

	provincium.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(provincium);
		}
	});
};

/**
 * Show the current Provincium
 */
exports.read = function(req, res) {
	res.jsonp(req.provincium);
};

/**
 * Update a Provincium
 */
exports.update = function(req, res) {
	var provincium = req.provincium ;

	provincium = _.extend(provincium , req.body);

	provincium.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(provincium);
		}
	});
};

/**
 * Delete an Provincium
 */
exports.delete = function(req, res) {
	var provincium = req.provincium ;

	provincium.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(provincium);
		}
	});
};

/**
 * List of Provincia
 */
exports.list = function(req, res) { 
	Provincium.find().sort('-created').populate('user', 'displayName').exec(function(err, provincia) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(provincia);
		}
	});
};

/**
 * Provincium middleware
 */
exports.provinciumByID = function(req, res, next, id) { 
	Provincium.findById(id).populate('user', 'displayName').exec(function(err, provincium) {
		if (err) return next(err);
		if (! provincium) return next(new Error('Failed to load Provincium ' + id));
		req.provincium = provincium ;
		next();
	});
};

/**
 * Provincium authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.provincium.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
