'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Producto Schema
 */
var ProductoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Producto name',
		trim: true
	},
	tipoconcepto: {
		type: Schema.ObjectId,
		ref: 'Tipoconcepto'
	},
	unidadmedida: {
		type: Schema.ObjectId,
		ref: 'Unidadmedida'
	},
	precio: {
		type: Number,
	},
	tipoiva: {
		type: Schema.ObjectId,
		ref: 'Tipoiva'
	},
	cuentacontable: {
		type: Schema.ObjectId,
		ref: 'Cuentacontable'
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

mongoose.model('Producto', ProductoSchema);