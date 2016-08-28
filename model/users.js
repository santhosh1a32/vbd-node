var mongoose = require('mongoose');

/* Schema for user table */

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	userName: String,
	password: String
});

module.exports = mongoose.model('Users', UserSchema);