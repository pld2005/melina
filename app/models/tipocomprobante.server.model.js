'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tipocomprobante Schema
 */
var TipocomprobanteSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Tipocomprobante name',
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

mongoose.model('Tipocomprobante', TipocomprobanteSchema);