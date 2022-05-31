module.exports = app => {
	
	const Evaluadore = require("../models/evaluadores.model.js");
	const Evaluado = require("../models/evaluado.model.js");
	const Pregunta = require("../models/preguntas.model.js");
	
	const express = require('express');
	const router = express.Router();
	app.use('/', router);
	
	
	// Retrieve all
  router.get("/evaluadores", async(req, res)=>{
	  const data = await Evaluadore.find({})
	  const vsession = req.session;
	  res.render('evaluador/all',{ data, vsession })
  });
	
	// Retrieve list of forms
  router.get("/evaluadores/list", async(req, res)=>{
	  const data = await Evaluadore.find({})
	  const vsession = req.session;
	  res.render('evaluador/lista',{ data, vsession })
  });
	
	// Retrieve a single Person with Id
  router.get("/evaluadores/:evaluadorId", async(req, res)=>{
	  const data = await Evaluadore.findOne({_id:req.params.evaluadorId});
	  const quest = await Pregunta.findOne({});
	  const vsession = req.session;
	  res.render('evaluador/byId',{ data, quest, vsession })
  });
	
	// FORM with Id
  router.get("/form/:evaluadorId", async(req, res)=>{
	  const data = await Evaluadore.findOne({_id:req.params.evaluadorId});
	  const quest = await Pregunta.findOne({});
	  const vsession = req.session;
	  res.render('evaluador/form',{ data, quest, vsession })
  });
	
	// POST FORM
  router.post("/form/:evaluadorId", async(req, res)=>{
	  const id = req.params.evaluadorId;
	  var nDate = new Date;
	  Evaluadore.findOneAndUpdate({"_id":id},{"localidad": req.body.localidad, "seccion": req.body.seccion, "lastdate": nDate, "contesto":true }, function(err, result){
        if(err){
            res.send(err);
        }
    })
	  const evaluador = await Evaluadore.findOne({_id:id});
	  for(let i=0;i<req.body.arr.length;i++){
		  evaluador.evaluando[i].respuestas = req.body.arr[i];
	  }
	  evaluador.save();
	  res.redirect('/gracias')
  });
	
	router.get("/gracias", async(req, res)=>{
	  const vsession = req.session;
	  res.render('evaluador/gracias',{ vsession })
  });
	
	// Create
  app.post("/evaluadores/cruz", async(req, res)=>{
	  
	  const data = await Evaluado.find({});
	  for (let elemento of data) {
		  const evaluador = new Evaluadore({ nombre:elemento.nombre });
		  evaluador.evaluando.push({nombre:elemento.nombre});
		  evaluador.save();
	  }
	  for (let elemento of data) {
		  for (let e of elemento.evaluadores) {
			  const data2 = await Evaluadore.findOne({nombre:e.nombre});
			  if(data2){
				  data2.evaluando.push({nombre:elemento.nombre});
				  data2.save();
			  } else {
				  const evaluador = new Evaluadore({ nombre:e.nombre });
				  evaluador.evaluando.push({nombre:elemento.nombre});
				  evaluador.save();
			  }
		  }
	  }
	  req.flash('succes','Se han cruzado los evaluadores');
	  res.redirect('/evaluadores')
  });
	
	// Delete All
  app.delete("/evaluadores", async(req, res)=>{
	  await Evaluadore.deleteMany({})
	  req.flash('del','Todo se ha borrado');
	  res.redirect('/evaluadores')
  })
	
};
