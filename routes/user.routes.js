module.exports = app => {
  const users = require("../controllers/users.controller.js");
	
	//ROUTER MIDDELWARE
	const express = require('express');
	const router = express.Router();
	const isLogIn = (req, res, next) => {
		if(req.session.isAdmin == false || req.session.email == undefined){
			req.flash('wrong','Debe Ingresar como Usuario')
			return res.redirect('/')
		}
		next();
	}
	app.use('/', router);
	
  //new
  router.get('/users/new',isLogIn, (req,res)=>{
	  var vsession = req.session;
	  res.render('users/new',{vsession})})
	
  // Create a new Customer
  app.post("/users", users.create);

  // Retrieve all Customers
  router.get("/users", isLogIn, users.findAll);

  // Retrieve a single Customer with customerId
  router.get("/users/:userId", isLogIn, users.findOne);

  // Update a Customer with customerId
  app.put("/users/:userId", users.update);

  // Delete a Customer with customerId
  app.delete("/users/:userId", users.delete);
};