'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Settingempresa Schema
 */
var SettingempresaSchema = new Schema({
	name: {
		type: String
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
	puntoventa: {
		type: Number
	},
	iibb: {
		type: String
	},
	inicioactividades: {
		type: Date
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
	nroFacturaA: {
		type: Number
	},
	nroFacturaB: {
		type: Number
	},
	nroFacturaC: {
		type: Number
	},
	nroNCA: {
		type: Number
	},
	nroNCB: {
		type: Number
	},
	nroNCC: {
		type: Number
	},
	nroNDA: {
		type: Number
	},
	nroNDB: {
		type: Number
	},
	nroNDC: {
		type: Number
	},
	nroRecibo:{
		type: Number
	},
	facturaProductos:{
		type: Boolean
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

mongoose.model('Settingempresa', SettingempresaSchema);