'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Settingempresa = mongoose.model('Settingempresa'),
	_ = require('lodash');

/**
 * Create a Settingempresa
 */
exports.create = function(req, res) {
	var settingempresa = new Settingempresa(req.body);
	settingempresa.user = req.user;

	settingempresa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
//------------------------------------------------------------------------------------------------------
			var user = req.user;
			user = _.extend(user , {settingempresa: settingempresa._id });

			user.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
			});
//------------------------------------------------------------------------------------------------------


			res.jsonp(settingempresa);
		}
	});
};

/**
 * Show the current Settingempresa
 */
exports.read = function(req, res) {
	res.jsonp(req.settingempresa);
};

/**
 * Update a Settingempresa
 */
exports.update = function(req, res) {
	var settingempresa = req.settingempresa ;

	settingempresa = _.extend(settingempresa , req.body);

	settingempresa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
//------------------------------------------------------------------------------------------------------
			var user = req.user;
			user = _.extend(user , {settingempresa: settingempresa._id });

			user.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} 
			});
//------------------------------------------------------------------------------------------------------


			res.jsonp(settingempresa);
		}
	});
};

/**
 * Delete an Settingempresa
 */
exports.delete = function(req, res) {
	var settingempresa = req.settingempresa ;

	settingempresa.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(settingempresa);
		}
	});
};

/**
 * List of Settingempresas
 */
exports.list = function(req, res) { 
	Settingempresa.find({'user': req.user}).sort('-created').populate('user', 'displayName').exec(function(err, settingempresas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(settingempresas);
		}
	});
};

/**
 * Settingempresa middleware
 */
exports.settingempresaByID = function(req, res, next, id) { 
	Settingempresa.findById(id).populate('user', 'displayName').exec(function(err, settingempresa) {
		if (err) return next(err);
		if (! settingempresa) return next(new Error('Failed to load Settingempresa ' + id));
		req.settingempresa = settingempresa ;
		next();
	});
};

/**
 * Settingempresa authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.settingempresa.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
