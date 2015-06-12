'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Factura Schema
 */
var FacturaSchema = new Schema({
	puntoventa: {
		type: Number
	},
	numero: {
		type: Number
	},
	numeroCompleto: {
		type: String
	},
	tipoFac: {
		type: String
	},
	fecha: {
		type: Date,
		default: Date.now,
		required: 'Ingrese la fecha del comprobante'
	},
	fechaCobro: {
		type: Date,
		default: Date.now
	},
	neto: {
		type: Number
	},
	netoNoGravado: {
		type: Number
	},
	exento: {
		type: Number
	},
	total: {
		type: Number
	},
	iva21: {
		type: Number
	},
	iva105: {
		type: Number
	},
	tipocomprobante: {
		type: Number // 0: Factura - 1: Nota de Credito - 2: Nota de Debito
	},
	cliente: {
		type: Schema.ObjectId,
		ref: 'Cliente',
		required: 'Seleccione un cliente'
	},
	items: [
		{
			cantidad: {
				type: Number
			},
			producto: {
				type: Schema.ObjectId,
				ref: 'Producto'
			},
			descripcion: {
				type: String
			},
			precio: {
				type: Number
			},
			descuento: {
				type: Number
			},
			tipoiva: {
				type: Schema.ObjectId,
				ref: 'Tipoiva'
			},
			valoriva: {
				type: Number
			},
			subtotal: {
				type: Number
			}
		}
	],
	cae: {
		type: String
	},
	vto_cae: {
		type: Date
	},
	XmlRequest: {
		type: String
	},
	XmlResponse: {
		type: String
	},
	Msg: {
		type: String
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

mongoose.model('Factura', FacturaSchema);