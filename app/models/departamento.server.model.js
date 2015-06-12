'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Departamento Schema
 */
var DepartamentoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Departamento name',
		trim: true
	},
	id: {
		type: Number,
		default: '',
	},
	provincia_id: {
		type: String,
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

mongoose.model('Departamento', DepartamentoSchema);

