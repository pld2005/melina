'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Provincium Schema
 */
var ProvinciumSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Provincium name',
		trim: true
	},
	id: {
		type: Number,
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

mongoose.model('Provincium', ProvinciumSchema);