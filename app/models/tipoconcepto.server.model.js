'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tipoconcepto Schema
 */
var TipoconceptoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Tipoconcepto name',
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

mongoose.model('Tipoconcepto', TipoconceptoSchema);