//Middleware
module.exports = {
  isLogIn: (req, res, next) => {
    if (req.session.user == undefined) {
      req.flash("wrong", "Debe Ingresar como Usuario");
      return res.redirect("/");
    }
    next();
  },
  hasAnswered: async (req, res, next) => {
    const Evaluadore = require("../models/evaluadores.model.js");
    const data = await Evaluadore.findOne({ _id: req.params.evaluadorId });
    if (data.contesto) {
      req.flash("wrong", "Ya ha contestato");
      return res.redirect("/gracias");
    }
    next();
  },
};
