const User = require("../models/users.model.js");

// Create and Save a new Customer
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Customer
  const user = new User({
    email: req.body.email,
    password: req.body.password,
	isAdmin: req.body.isAdmin,
	isLab:req.body.isLab,
	isEmp:req.body.isEmp
  });
	
  // Save Customer in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the usuario."
      });
    // else res.send(data);
	  else {
		  req.flash('succes','El usuario se ha guardado');
		  res.redirect('/users')}
  });
};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    else {
		var vsession = req.session;
		res.render('users/all',{ data, vsession });
	}
  });
};

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
  User.findById(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id " + req.params.userId
        });
      }
    } 
	  else {
		var vsession = req.session;
		res.render('users/byId',{ data, vsession });
	}
  });
};

// Update a Customer identified by the customerId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  User.updateById(
    req.params.userId,
    new User(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Customer with id ${req.params.userId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Customer with id " + req.params.userId
          });
        }
      } 
		else {
			req.flash('succes','El usuario se ha actualizado');
			res.redirect('/users/'+req.params.userId);}
    }
  );
};

// Delete a Customer with the specified customerId in the request
exports.delete = (req, res) => {
  User.remove(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Customer with id " + req.params.userId
        });
      }
    } 
	  // else res.send({ message: `Customer was deleted successfully!` });
	  else {
		  req.flash('del','El usuario se ha borrado');
		  res.redirect('/users')}
  });
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
  User.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all customers."
      });
	  else {
		  req.flash('del','Se ha borrado todo con exito');
		  res.redirect('/users')}
  });
};