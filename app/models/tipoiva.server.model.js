'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tipoiva Schema
 */
var TipoivaSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Tipoiva name',
		trim: true
	},
	idafip: {
		type: Number,
	},
	valor: {
		type: Number,
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

mongoose.model('Tipoiva', TipoivaSchema);