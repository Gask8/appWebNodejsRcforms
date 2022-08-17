module.exports = app => {
	
	const User = require("../models/user.model.js");
	const Pregunta = require("../models/preguntas.model.js");
	const express = require('express');
	const router = express.Router();
	app.use('/', router);
	
  router.post('/sign', async(req,res)=>{
	  const data = await User.findOne({user:req.body.user});
	  if(data){
		  if(data.password==req.body.password){
			  req.session.user = data.user;
			  const qyd = await Pregunta.find({});
			  req.session.itandas = [];
			  req.session.ntandas = [];
			  for (let e of qyd){
				  req.session.itandas.push(e.idt);
				  req.session.ntandas.push(e.name);
			  }
			  req.flash('succes','Usuario Correcto');
		  } else {
			  req.flash('wrong','Mal password');
		  }
	  } else {
		  req.flash('wrong','No exite Usuario');
	  }
	  res.redirect('/')
  });
	
  router.get("/logout", async(req, res)=>{
	  req.session.destroy();
	  res.redirect('/');
  });
	
	
};
