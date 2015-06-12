'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Condicioniva Schema
 */
var CondicionivaSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Condicioniva name',
		trim: true
	},
	idafip: {
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

mongoose.model('Condicioniva', CondicionivaSchema);