'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PintUser = new Schema({
	twitter: {
		id: String,
		username: String,
		displayName: String
	},
	images: []
});

module.exports = mongoose.model('PintUser', PintUser);
