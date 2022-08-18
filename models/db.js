// const mysql = require("mysql");
const mongoose = require('mongoose');
const dbConfig = require("../config/db.config.js");

// Create a connection to the database
// const connection = mysql.createConnection({
//   host: dbConfig.HOST,
//   user: dbConfig.USER,
//   password: dbConfig.PASSWORD,
//   database: dbConfig.DB
// });
// open the MySQL connection
// connection.connect(error => {
//   if (error) throw error;
//   console.log("Successfully connected to the database.");
// });

const connection = mongoose.connect(dbConfig.LINKM)
	.then(()=>{
	console.log("Successfully connected to the database.");
})
	.catch(()=>{
	console.log("ERROR EN DB");
	console.log(err);
});

module.exports = connection;
