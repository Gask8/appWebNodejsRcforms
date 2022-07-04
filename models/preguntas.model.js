const mongoose = require('mongoose');
const conection = require("./db.js");

const preguntaSchema = new mongoose.Schema({
	tanda: Number,
	preg: {
		type: [String]
	},
	label: {
		type: [String]
	},
	val: {
		type: [Number]
	},
	categoria: {
		type: [String]
	},
	cati: {
		type: [Number]
	}
});

const Pregunta = mongoose.model('Pregunta', preguntaSchema);
module.exports = Pregunta;