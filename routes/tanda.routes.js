module.exports = app => {
	const mw = require("./middelware.js");
	const Pregunta = require("../models/preguntas.model.js");
	const express = require('express');
	const router = express.Router();
	app.use('/tandas', mw.isLogIn, router);
	
	// ALL Get
  router.get("/", async(req, res)=>{
	  const data = await Pregunta.find({})
	  const vsession = req.session;
	  res.render('tanda/all',{ data, vsession })
  });	
	
	// New Get
  router.get('/new', (req,res)=>{
	  var vsession = req.session;
	  res.render('tanda/new',{vsession})
  });
	
	// New Post
  router.post("/", async(req, res)=>{
	  const data = req.body;
		var x = data.preg.split('\r\n');
		var y = data.label.split('\r\n');
		var z = data.val.split('\r\n');
		var v = data.cat.split('\r\n');
		var w = data.cati.split('\r\n');
	  
	  await Pregunta.create({"name":data.name, "idt":data.idt, "preg": x, "label": y, "val": z, "categoria": v, "cati": w}, function(err, result){
			if(err){
				res.send(err);
		}});
	  
	  req.flash('succes','La tanda se ha agregado');
	  res.redirect('/tandas')
  });

	// ById Get
  router.get("/edit/:tandaId", async(req, res)=>{
  const data = await Pregunta.findOne({_id:req.params.tandaId});
  const vsession = req.session;
  res.render('tanda/byId',{ data, vsession })
  });
	
	// ById Put
  router.put("/:tandaId", async(req, res)=>{
	  const data = req.body;
		var x = data.preg.split('\r\n');
		var y = data.label.split('\r\n');
		var z = data.val.split('\r\n');
		var v = data.cat.split('\r\n');
		var w = data.cati.split('\r\n');
	  
		Pregunta.findOneAndUpdate({_id:req.params.tandaId},{"name":data.name, "idt":data.idt, "preg": x, "label": y, "categoria": v, "cati": w}, function(err, result){
			if(err){
				res.send(err);
		}});
		// Pregunta.findOneAndUpdate({},{"preg": x, "val": z, "label": y, "categoria": v, "cati": w}, function(err, result){

		req.flash('succes','Las tanda se han actualizado');
		res.redirect('/tandas')
  });
	
	
	// ById Menu Get
  router.get("/:tandaId", async(req, res)=>{
	  const data = await Pregunta.findOne({idt:req.params.tandaId});
	  const vsession = req.session;
	  res.render('tanda/menu',{ data, vsession })
  });
	

	// Delete a Customer with customerId
  // router.delete("/:evaluadoId", async(req, res)=>{
  // await Evaluado.findByIdAndDelete(req.params.evaluadoId);
  // req.flash('del','El Evaluado se ha borrado');
  // res.redirect('/evaluados')
  // });
	
	
};
