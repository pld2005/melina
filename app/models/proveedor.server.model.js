'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Proveedor Schema
 */
var ProveedorSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Proveedor name',
		trim: true
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

mongoose.model('Proveedor', ProveedorSchema);