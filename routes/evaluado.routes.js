module.exports = app => {
	
	const Evaluado = require("../models/evaluado.model.js");
	const express = require('express');
	const router = express.Router();
	app.use('/evaluados', router);
	
	//new
  router.get('/new', (req,res)=>{
	  var vsession = req.session;
	  res.render('evaluado/new',{vsession})
  });
	
// Create new
  router.post("/", async(req, res)=>{
	  const data = req.body;
	  var evaluado;
	  var x = data.evaluadores.split('\r\n');
	  for (let i = 0; i < x.length; i++) {
		  let y = x[i].split(',');
		  let obj = {nombre:y[0],posicion:y[2],categoria:y[1],correo:y[3]}
		  if(i==0){
			  evaluado = new Evaluado({ nombre:y[0],posicion:y[2],categoria:y[1],correo:y[3] });
		  }
		  evaluado.evaluadores.push(obj);
		}
	  evaluado.save();
	  req.flash('succes','El evaluado se ha agregado');
	  res.redirect('/evaluados')
  });
	
  // Retrieve all
  router.get("/", async(req, res)=>{
	  const evaluados = await Evaluado.find({})
	  const vsession = req.session;
	  res.render('evaluado/all',{ evaluados, vsession })
  });
	
	// Retrieve a single Person with Id
  router.get("/:evaluadoId", async(req, res)=>{
	  const data = await Evaluado.findOne({_id:req.params.evaluadoId});
	  const vsession = req.session;
	  res.render('evaluado/byId',{ data, vsession })
  });
	
	// Delete a Customer with customerId
  router.delete("/:evaluadoId", async(req, res)=>{
	  await Evaluado.findByIdAndDelete(req.params.evaluadoId);
	  req.flash('del','El Evaluado se ha borrado');
	  res.redirect('/evaluados')
  });
	
	
};
