module.exports = app => {
	const mw = require("./middelware.js");
	const Evaluadore = require("../models/evaluadores.model.js");
	const Evaluado = require("../models/evaluado.model.js");
	const Pregunta = require("../models/preguntas.model.js");
	
	const express = require('express');
	const router = express.Router();
	app.use('/', router);
	
	// FORM with Id
  router.get("/form/:evaluadorId", mw.hasAnswered, async(req, res)=>{
	  const data = await Evaluadore.findOne({_id:req.params.evaluadorId});
	  const quest = await Pregunta.findOne({idt:data.idt});
	  const vsession = req.session;
	  res.render('form/form',{ data, quest, vsession })
  });
	
	// POST FORM
  router.post("/form/:evaluadorId", mw.hasAnswered, async(req, res)=>{
	  const id = req.params.evaluadorId;
	  var nDate = new Date;
	  Evaluadore.findOneAndUpdate({"_id":id},{"localidad": req.body.localidad, "quienlleno": req.body.fname, "seccion": req.body.seccion, "lastdate": nDate, "contesto":true }, function(err, result){
        if(err){
            res.send(err);
        }
    })
	  const evaluador = await Evaluadore.findOne({_id:id});
	  for(let i=0;i<req.body.arr.length;i++){
		  evaluador.evaluando[i].respuestas = req.body.arr[i];
		  const evaluado = await Evaluado.findOne({nombre:evaluador.evaluando[i].nombre,idt:evaluador.idt});
		  if(evaluado){
			await Evaluado.findOneAndUpdate(
				{ _id: evaluado._id, "evaluadores.nombre": evaluador.nombre },
				{
					$set: {
						"evaluadores.$.respuestas": req.body.arr[i],
						"evaluadores.$.contesto": true
					 }
				}
			)
		  }
	  }
	  evaluador.save();
	  res.redirect('/gracias')
  });
	
	//Gracias Get
	router.get("/gracias", async(req, res)=>{
	  const vsession = req.session;
	  res.render('form/gracias',{ vsession })
  });

	
};
