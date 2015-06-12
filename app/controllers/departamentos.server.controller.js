'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Departamento = mongoose.model('Departamento'),
	_ = require('lodash');

/**
 * Create a Departamento
 */
exports.create = function(req, res) {
	var departamento = new Departamento(req.body);
	departamento.user = req.user;

	departamento.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(departamento);
		}
	});
};

/**
 * Show the current Departamento
 */
exports.read = function(req, res) {
	res.jsonp(req.departamento);
};

/**
 * Update a Departamento
 */
exports.update = function(req, res) {
	var departamento = req.departamento ;

	departamento = _.extend(departamento , req.body);

	departamento.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(departamento);
		}
	});
};

/**
 * Delete an Departamento
 */
exports.delete = function(req, res) {
	var departamento = req.departamento ;

	departamento.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(departamento);
		}
	});
};

/**
 * List of Departamentos
 */
exports.list = function(req, res) { 
	Departamento.find().sort('-created').populate('user', 'displayName').exec(function(err, departamentos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(departamentos);
		}
	});
};

/**
 * Departamento middleware
 */
exports.departamentoByID = function(req, res, next, id) { 
	Departamento.findById(id).populate('user', 'displayName').exec(function(err, departamento) {
		if (err) return next(err);
		if (! departamento) return next(new Error('Failed to load Departamento ' + id));
		req.departamento = departamento ;
		next();
	});
};

/**
 * Departamento authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.departamento.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


exports.DepartamentByProvincia = function(req, res, next) {
	var provinciaId = (req.params.provincia === '') ? '' : req.params.provincia;
		Departamento.find({ provincia_id: provinciaId }).sort('-created').populate('user', 'displayName').exec(function(err, departamentos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(departamentos);
		}
	});


	
};