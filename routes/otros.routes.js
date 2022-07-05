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
	  const quest = await Pregunta.findOne({});
	  const vsession = req.session;
	  res.render('otros/form',{ data, quest, vsession })
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
		  const evaluado = await Evaluado.findOne({nombre:evaluador.evaluando[i].nombre});
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
	
	//Gracias Render
	router.get("/gracias", async(req, res)=>{
	  const vsession = req.session;
	  res.render('otros/gracias',{ vsession })
  });
	
	
	//PREGUNTAS AND ALTER
  router.get('/preguntas', mw.isLogIn, async (req,res)=>{
	  const data = await Pregunta.findOne({});
	  var vsession = req.session;
	  res.render('otros/preguntas',{data, vsession})
  });
	
  router.post("/preguntas", mw.isLogIn, async(req, res)=>{
		const data = req.body;
		var x = data.preg.split('\r\n');
		// var y = data.label.split('\r\n');
		// var z = data.val.split('\r\n');
		// var v = data.cat.split('\r\n');
		// var w = data.cati.split('\r\n');
	  
		Pregunta.findOneAndUpdate({},{"preg": x}, function(err, result){
			if(err){
				res.send(err);
		}});
		// Pregunta.findOneAndUpdate({},{"preg": x, "val": z, "label": y, "categoria": v, "cati": w}, function(err, result){
		// 	if(err){
		// 		res.send(err);
		// }});

		req.flash('succes','Las preguntas se han actualizado');
		res.redirect('/preguntas')
  });
	
};
