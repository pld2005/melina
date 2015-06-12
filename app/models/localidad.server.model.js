'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Localidad Schema
 */
var LocalidadSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Localidad name',
		trim: true
	},
	id: {
		type: Number,
		default: '',
	},
	departamento_id: {
		type: Number,
		default: '',
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

mongoose.model('Localidad', LocalidadSchema);