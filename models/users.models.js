const sql = require("./db.js");

// constructor
const User = function(user) {
  this.id = user.id;
  this.email = user.email;
  this.password = user.password;
  this.isAdmin = user.isAdmin;
  this.isLab = user.isLab;
  this.isEmp = user.isEmp;
};

User.create = (newCustomer, result) => {
  sql.query("INSERT INTO user SET ?", newCustomer, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...newCustomer });
    result(null, { id: res.insertId, ...newCustomer });
  });
};

User.findById = (customerId, result) => {
  sql.query(`SELECT * FROM user WHERE id = ${customerId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

User.getAll = result => {
  sql.query("SELECT * FROM user", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
	  console.log("found all users: ");
    // console.log("customers: ", res);
    result(null, res);
  });
};


User.updateById = (id, customer, result) => {
  sql.query(
    "UPDATE user SET email = ?, password = ?, isAdmin = ?, isLab = ?, isEmp = ? WHERE id = ?",
    [customer.email, customer.password, customer.isAdmin, customer.isLab, customer.isEmp, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { id: id, ...customer });
      result(null, { id: id, ...customer });
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM user WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

User.removeAll = result => {
  sql.query("DELETE FROM user", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} users`);
    result(null, res);
  });
};

module.exports = User;