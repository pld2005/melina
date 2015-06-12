'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Unidadmedida Schema
 */
var UnidadmedidaSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Unidadmedida name',
		trim: true
	},
	idafip: {
		type: String,
		trim: true,
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Unidadmedida', UnidadmedidaSchema);