'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Cliente Schema
 */
var ClienteSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Ingrese el nombre del Cliente',
		trim: true
	},
	cuit: {
		type: String,
		default: '',
		required: 'Ingrese el CUIT del cliente',
		trim: true
	},
	condicioniva: {
		type: Schema.ObjectId,
		ref: 'Condicioniva',
		required: 'Ingrese la Condición de IVA del Cliente',
	},
	email: {
		type: String,
		trim: true,
		default: '',
		match: [/.+\@.+\..+/, 'Ingrese una diracción de email válida']
	},
	telefono: {
		type: String,
		default: '',
		trim: true
	},
	domicilio: {
		type: String,
		default: '',
		trim: true
	},		
	localidad: {
		type: String,
		default: '',
		trim: true
	},	
	provincia: {
		type: String,
		default: '',
		trim: true
	},
	pais: {
		type: String,
		default: '',
		trim: true
	},
	cuentacontable: {
		type: String,
		default: '',
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

mongoose.model('Cliente', ClienteSchema);