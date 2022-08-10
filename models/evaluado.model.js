const mongoose = require('mongoose');
const conection = require("./db.js");

const evaluadoSchema = new mongoose.Schema({
	nombre: String,
	posicion: String,
	idt: Number,
	categoria: String,
	correo: String,
	evaluadores: [{
		nombre: {
			type: String,
			required: true
		},
		posicion: {
			type: String,
			default : null
			
		},
		respuestas: {
			type: [Number]
		},
		comentarios: {
			type: [String]
		},
		categoria: {
			type: String,
			required: true
		},
		correo: {
			type: String,
			required: true
		},
		contesto: {
        	type: Boolean,
        	default: false
    	}
	}]
});

const Evaluado = mongoose.model('Evaluado', evaluadoSchema);
module.exports = Evaluado;