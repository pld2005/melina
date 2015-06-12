'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tipoconcepto = mongoose.model('Tipoconcepto'),
	_ = require('lodash');

/**
 * Create a Tipoconcepto
 */
exports.create = function(req, res) {
	var tipoconcepto = new Tipoconcepto(req.body);
	tipoconcepto.user = req.user;

	tipoconcepto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipoconcepto);
		}
	});
};

/**
 * Show the current Tipoconcepto
 */
exports.read = function(req, res) {
	res.jsonp(req.tipoconcepto);
};

/**
 * Update a Tipoconcepto
 */
exports.update = function(req, res) {
	var tipoconcepto = req.tipoconcepto ;

	tipoconcepto = _.extend(tipoconcepto , req.body);

	tipoconcepto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipoconcepto);
		}
	});
};

/**
 * Delete an Tipoconcepto
 */
exports.delete = function(req, res) {
	var tipoconcepto = req.tipoconcepto ;

	tipoconcepto.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipoconcepto);
		}
	});
};

/**
 * List of Tipoconceptos
 */
exports.list = function(req, res) { 
	Tipoconcepto.find().sort('name').populate('user', 'displayName').exec(function(err, tipoconceptos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipoconceptos);
		}
	});
};

/**
 * Tipoconcepto middleware
 */
exports.tipoconceptoByID = function(req, res, next, id) { 
	Tipoconcepto.findById(id).populate('user', 'displayName').exec(function(err, tipoconcepto) {
		if (err) return next(err);
		if (! tipoconcepto) return next(new Error('Failed to load Tipoconcepto ' + id));
		req.tipoconcepto = tipoconcepto ;
		next();
	});
};

/**
 * Tipoconcepto authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tipoconcepto.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
