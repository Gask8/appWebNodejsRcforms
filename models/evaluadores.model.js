const mongoose = require('mongoose');
const conection = require("./db.js");

const evaluadorSchema = new mongoose.Schema({
	nombre: String,
	idt: Number,
	localidad: String,
	seccion: String,
	quienlleno: String,
	correo: String,
	semando: {
		type: Boolean,
		default: false
	},
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