module.exports = app => {
	const mw = require("./middelware.js");
	const Evaluadore = require("../models/evaluadores.model.js");
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
			user: 'gasalandra@lcred.org',
			pass: 'CristoR8'
		}
	});
	
	// Send All
  router.post("/", async(req, res)=>{
	  const data = await Evaluadore.find({"semando":"false"}).limit(5);
	  var j=0;
	  var time=1000;
	  for(let e of data){
		  
		setTimeout(() => {
			var string = "";
				for(eva of e.evaluando){
				  string+=eva.nombre+", ";
				}
				var mailOptions = {
					from: 'RCForms', // sender address (who sends)
					to: 'aariza@arcol.org', // list of receivers (who receives)
					subject: 'Evaluación 360º '+e.nombre+'', // Subject line
					text: 'Evaluación 360º', // plaintext body
					html: "<p>¡Venga tu Reino!</p><p>Estimado en Cristo, "+e.nombre+"</p><p>Un saludo, esperando que tanto usted como su familia se encuentre muy bien. </p><p>Es un gusto para mi anunciarle que ha sido elegido para contestar la evaluación 360º que se está realizando desde la Oficina Territorial de Apostolado. </p><p>En esta evaluación, usted podrá evaluar las habilidades que ha observado en el Director o Directores de Apostolado a evaluar, es este caso ha sido elegido para evaluar a "+string+". Cabe aclarar que:</p><ol type='1' style='font-variant-caps:normal; orphans:auto; text-align:start; widows:auto; word-spacing:0px'><li style='text-align:justify'><p>En cada una de las preguntas encontrará el nombre de la o las personas que debe evaluar. Esto se hizo así con el objetivo de facilitar su aportación, enviándole una sola liga dónde pueda responder la evaluación de todas las personas de una sola vez. Por ello le pedimos lea cuidadosamente cada una de las preguntas y cada una de las opciones de respuesta. Un ejemplo de como va a encontrar las preguntas y las opciones de respuesta es:</p><img src='https://rcforms.run-us-west2.goorm.io/images/imgmuestra.png'></li><li style='text-align:justify'><p>No importa si usted ya no cuenta con algun puesto activo dentro de localidad o sección, si fue seleccionado es porque conoce bien a la persona evaluada o ha trabajado con ella en alguna medida y se considera que podrá aportar una evaluación mucho más completa y objetiva.</p></li></ol><p>Por último, le pedimos que dé click en el siguiente link para ingresar a la encuesta:</p><a href='https://rcforms.run-us-west2.goorm.io/form/"+e._id+"'>https://rcforms.run-us-west2.goorm.io/form/"+e._id+"</a><p>La <b>fecha límite</b> para contestar esta evaluación es el <b>20 de Mayo</b>.</p><p>Si tiene alguna duda o inconveniente puede comunicarse con Ana Paula Ariza (aariza@arcol.org) la coordinadora de Recursos Humanos de la Oficina Territorial de Apostolado. Su participación es muy imortante para el crecimiento y desarrollo de las personas evaluadas. De antemano agradecemos mucho su tiempo y dedicación puesto en esta evaluación que Dios le bendiga.</p><img src='https://rcforms.run-us-west2.goorm.io/images/mailAnaPau.png'>" 
				};

				// send mail with defined transport object
				transporter.sendMail(mailOptions, function(error, info){
					if(error){
						// return console.log(error);
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
	  res.redirect('/evaluadores/list');
  });

};