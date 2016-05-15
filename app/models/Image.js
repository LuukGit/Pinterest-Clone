'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Image = new Schema({
	title: String,
    URL: String
});

module.exports = mongoose.model('Image', Image);
