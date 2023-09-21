const mongoose = require("mongoose");
const conection = require("./db.js");

const preguntaSchema = new mongoose.Schema({
  name: String,
  idt: Number,
  mensaje: String,
  preg: {
    type: [String],
  },
  label: {
    type: [String],
  },
  val: {
    type: [Number],
  },
  categoria: {
    type: [String],
  },
  cati: {
    type: [Number],
  },
  message: String,
  messageS: String,
});

const Pregunta = mongoose.model("Pregunta", preguntaSchema);
module.exports = Pregunta;
