module.exports = app => {
	
	const Evaluadore = require("../models/evaluadores.model.js");
	const express = require('express');
	const router = express.Router();
	app.use('/evaluadores', router);
	
	
	// Retrieve all
  router.get("/", async(req, res)=>{
	  const data = await Evaluadore.find({})
	  const vsession = req.session;
	  res.render('evaluador/all',{ data, vsession })
  });
	
	// Retrieve list of forms
  router.get("/list", async(req, res)=>{
	  const data = await Evaluadore.find({})
	  const vsession = req.session;
	  res.render('evaluador/lista',{ data, vsession })
  });
	
	// Retrieve a single Person with Id
  router.get("/:evaluadorId", async(req, res)=>{
	  const Pregunta = require("../models/preguntas.model.js");
	  const data = await Evaluadore.findOne({_id:req.params.evaluadorId});
	  const quest = await Pregunta.findOne({});
	  const vsession = req.session;
	  res.render('evaluador/byId',{ data, quest, vsession })
  });
	
	// Create
  router.post("/cruz", async(req, res)=>{
	  const Evaluado = require("../models/evaluado.model.js");
	  const data = await Evaluado.find({});
	  for (let elemento of data) {
		  for (let e of elemento.evaluadores) {
			  const data2 = await Evaluadore.findOne({nombre:e.nombre});
			  if(data2){
				  data2.evaluando.push({nombre:elemento.nombre, correo:elemento.correo});
				  data2.save();
			  } else {
				  const evaluador = new Evaluadore({ nombre:e.nombre, correo:e.correo });
				  evaluador.evaluando.push({nombre:elemento.nombre});
				  evaluador.save();
			  }
		  }
	  }
	  req.flash('succes','Se han cruzado los evaluadores');
	  res.redirect('/evaluadores')
  });
	
	// Delete All
  router.delete("/", async(req, res)=>{
	  await Evaluadore.deleteMany({})
	  req.flash('del','Todo se ha borrado');
	  res.redirect('/evaluadores')
  })
	
};
