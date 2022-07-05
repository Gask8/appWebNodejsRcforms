module.exports = app => {
	
	const User = require("../models/user.model.js");
	const express = require('express');
	const router = express.Router();
	app.use('/', router);
	
  router.post('/sign', async(req,res)=>{
	  const data = await User.findOne({user:req.body.user});
	  if(data){
		  if(data.password==req.body.password){
			  req.session.user = data.user;
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
