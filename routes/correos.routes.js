module.exports = app => {
	const mw = require("./middelware.js");
	const Evaluadore = require("../models/evaluadores.model.js");
	const Pregunta = require("../models/preguntas.model.js");
	const express = require('express');
	const nodemailer = require('nodemailer');
	const router = express.Router();
	app.use('/correos', mw.isLogIn, router);

	var transporter = nodemailer.createTransport({
		host: "smtp-mail.outlook.com", // hostname
		secureConnection: false, // TLS requires secureConnection to be false
		port: 587, // port for secure SMTP
		tls: {
		   ciphers:'SSLv3'
		},
		auth: {
			user: 'aariza@lcred.org',
			pass: process.env.ANAPASSW
		}
	});

	// Send All
  router.post("/:idt", async(req, res)=>{
	  const idt = req.params.idt;
	  const data = await Evaluadore.find({idt:idt,"semando": "false","contesto":"false"}).limit(1);
	  const messageHTML = await Pregunta.findOne({idt:idt});
	  var j=0;
	  var time=1000;
	  for(let e of data){

		await setTimeout(() => {
			var string = "";
			for(eva of e.evaluando){
				if(eva.nombre == e.nombre){
					string+="Autoevaluación, ";
				} else {
					string+=eva.nombre+", ";
				}
			}
			var realmessage = messageHTML.message;
			var realmessage = realmessage.replace("|nombre|",e.nombre);
			var realmessage = realmessage.replace("|link|","<a href='https://rcforms.herokuapp.com/form/"+e._id+"'>https://rcforms.run-us-west2.goorm.io/form/"+e._id+"</a>");
			var realmessage = realmessage.replace("|evaluadores|",string);

				var mailOptions = {
					from: 'RCForms <aariza@lcred.org>', // sender address (who sends)
					to: "gasalandra@lcred.org", // list of receivers (who receives) e.correo
					subject: 'Evaluación 360° - '+messageHTML.messageS+" - "+e.nombre, // Subject line
					text: 'Evaluación 360°', // plaintext body
					html: realmessage
				};

				// send mail with defined transport object
				transporter.sendMail(mailOptions, function(error, info){
					if(error){
						return console.log(error);
						return;
					} else {
						Evaluadore.findOneAndUpdate({"_id":e._id},{"semando": "true"}, function(err, result){
							if(err){
								res.send(err);
						}});
					}
				});
				j++;
			}, time*j)
	  }

	  req.flash('succes','Se mandaron todos los correos');
	  res.redirect('/evaluadores/'+idt+'/list');
  });

};
