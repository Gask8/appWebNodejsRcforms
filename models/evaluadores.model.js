const mongoose = require('mongoose');
const conection = require("./db.js");

const evaluadorSchema = new mongoose.Schema({
	nombre: String,
	localidad: String,
	seccion: String,
	evaluando: [{
		nombre: {
			type: String,
			required: true
		},
		respuestas: {
			type: [Number]
		},
	}],
	lastdate: {
		type: Date,
		default: null
	},
	contesto: {
		type: Boolean,
		default: false
	}
});

const Evaluadore = mongoose.model('Evaluadore', evaluadorSchema);
module.exports = Evaluadore;