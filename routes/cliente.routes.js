module.exports = app => {
  const clientes = require("../controllers/cliente.controller.js");
	
	//ROUTER MIDDELWARE
	const express = require('express');
	const router = express.Router();
	const isLogIn = (req, res, next) => {
		if(req.session.isEmp == false || req.session.email == undefined){
			req.flash('wrong','Debe Ingresar como Usuario')
			return res.redirect('/')
		}
		next();
	}
	app.use('/', router);
	
  //new
  router.get('/clientes/new',isLogIn, (req,res)=>{
	  var vsession = req.session;
	  res.render('cliente/new',{vsession})})
	
  // Create a new Customer
  app.post("/clientes", clientes.create);

  // Retrieve all Customers
  router.get("/clientes", isLogIn, clientes.findAll);

  // Retrieve a single Customer with customerId
  router.get("/clientes/:clienteId", isLogIn, clientes.findOne);

  // Update a Customer with customerId
  app.put("/clientes/:clienteId", clientes.update);

  // Delete a Customer with customerId
  app.delete("/clientes/:clienteId", clientes.delete);

  // Create a new Customer
  app.delete("/clientes", clientes.deleteAll);
};
