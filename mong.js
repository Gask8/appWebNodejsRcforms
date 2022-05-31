const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/tanda4')
	.then(()=>{
	console.log("se logro");
})
	.catch(()=>{
	console.log("ERROR");
	console.log(err);
});

const evaluadoSchema = new mongoose.Schema({
	nombre: String,
	posicion: String,
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
const evaluados = Evaluado.find({});

for(let e in evaluados.evaluadores){
	console.log(e.nombre);
}
