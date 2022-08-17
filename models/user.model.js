const mongoose = require('mongoose');
const conection = require("./db.js");

const userSchema = new mongoose.Schema({
	user: {
		type: [String]
	},
	password: {
		type: [String]
	}
});

const User = mongoose.model('User', userSchema);
module.exports = User;