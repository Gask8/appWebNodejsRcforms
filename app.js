const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const methodOverride = require('method-override');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const flash = require('connect-flash');

//Especificaciones
app.use(express.static('public'))
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'))
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(sessions({secret: 'secretkey', resave: false, saveUninitialized: false}));
app.use(flash());

app.use((req,res,next)=>{
	res.locals.wrong = req.flash('wrong');
	res.locals.succes = req.flash('succes');
	res.locals.del = req.flash('del');
	next();
})
// Paths
app.get('/',(req,res)=>{var vsession = req.session;res.render('index', { vsession })})
//add the router
app.use('/', router);
require("./routes/sign.routes.js")(app);
require("./routes/evaluado.routes.js")(app);
require("./routes/evaluadores.routes.js")(app);
require("./routes/otros.routes.js")(app);
require("./routes/correos.routes.js")(app);

app.listen(process.env.port || 3000);
console.log('Running at Port 3000');