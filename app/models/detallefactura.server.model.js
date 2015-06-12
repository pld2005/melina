'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Detallefactura Schema
 */
var DetallefacturaSchema = new Schema({
	cantidad: {
		type: Number,
		default: 1,
		required: 'Ingrese la cantidad'
	},
	unidadmedida: {
		type: Schema.ObjectId,
		ref: 'Unidadmedida'
	},
	producto: {
		type: Schema.ObjectId,
		ref: 'Producto'
	},	
	precio: {
		type: Number,
		required: 'Ingrese la precio'
	},
	descuento: {
		type: Number
	},	
	tipoiva: {
		type: Schema.ObjectId,
		ref: 'Tipoiva'
	},
	valoriva: {
		type: Number,
		required: 'Ingrese el IVA'
	},
	subtotal: {
		type: Number,
		required: 'Ingrese la precio'
	},
	factura: {
		type: Schema.ObjectId,
		ref: 'Factura'
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

mongoose.model('Detallefactura', DetallefacturaSchema);