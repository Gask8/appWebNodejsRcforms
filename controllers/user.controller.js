const sql = require("../models/db.js");
const Log = require("../models/log.model.js");

const express = require('express');
const app = express();
const flash = require('connect-flash');
app.use(flash());

const User = function(user) {
  this.ids = user.id;
  this.email = user.email;
  this.password = user.password;
  this.isAdmin = user.isAdmin;
  this.isLab = user.isLab;
  this.isEmp = user.isEmp;
};


User.findById = (userEmail, result) => {
  sql.query(`SELECT * FROM user WHERE email = '${userEmail.email}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
	
  const user = new User({
	  email: req.body.email,
	  password: req.body.password
  });

	
  User.findById(user, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${userEmail}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id " + userEmail
        });
      }
    } 
	  else {
		  if(data.password==user.password){
			  req.session.ids = data.id;
			  req.session.email = data.email;
			  req.session.isAdmin = data.isAdmin;
			  req.session.isLab = data.isLab;
			  req.session.isEmp = data.isEmp;
			  
			  const log = new Log({
				id_usuario: data.id
			  });
			  
			  Log.create(log, (err, data) => {
				if (err)
				  res.status(500).send({
					message:
					  err.message || "Some error occurred while creating the Customer."
				  });
				  else {
					  req.flash('succes','Bienvenido')
					  res.redirect('/menu')
				  }
			  });

		  } else {
			  req.flash('wrong','Usuario o contrasena mala')
			  res.redirect('/')
		  }
	  }
  });
};