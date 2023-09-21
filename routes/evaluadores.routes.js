module.exports = (app) => {
  const mw = require("./middelware.js");
  const Evaluadore = require("../models/evaluadores.model.js");
  const express = require("express");
  const router = express.Router();
  app.use("/evaluadores", mw.isLogIn, router);

  // ALL Get
  router.get("/:idt", async (req, res) => {
    const idt = req.params.idt;
    const data = await Evaluadore.find({ idt: idt });
    const vsession = req.session;
    res.render("evaluador/all", { idt, data, vsession });
  });

  // All List Get
  router.get("/:idt/list", async (req, res) => {
    const idt = req.params.idt;
    const data = await Evaluadore.find({ idt: idt });
    const vsession = req.session;
    res.render("evaluador/lista", { idt, data, vsession });
  });

  // New Cruz Post
  router.post("/:idt/cruz", async (req, res) => {
    const Evaluado = require("../models/evaluado.model.js");
    const idt = req.params.idt;
    const data = await Evaluado.find({ idt: idt });
    for (let elemento of data) {
      for (let e of elemento.evaluadores) {
        const data2 = await Evaluadore.findOne({ nombre: e.nombre, idt: idt });
        if (data2) {
          data2.evaluando.push({
            nombre: elemento.nombre,
            correo: elemento.correo,
          });
          data2.save();
        } else {
          const evaluador = new Evaluadore({
            nombre: e.nombre,
            correo: e.correo,
            idt: idt,
          });
          evaluador.evaluando.push({ nombre: elemento.nombre });
          evaluador.save();
        }
      }
    }
    req.flash("succes", "Se han cruzado los evaluadores");
    res.redirect("/evaluadores/" + idt);
  });

  // ById Get
  router.get("/:idt/:evaluadorId", async (req, res) => {
    const Pregunta = require("../models/preguntas.model.js");
    const idt = req.params.idt;
    const data = await Evaluadore.findOne({ _id: req.params.evaluadorId });
    const quest = await Pregunta.findOne({ idt: idt });
    const vsession = req.session;
    res.render("evaluador/byId", { idt, data, quest, vsession });
  });

  // All Delete
  router.delete("/:idt", async (req, res) => {
    const idt = req.params.idt;
    await Evaluadore.deleteMany({ idt: idt });
    req.flash("del", "Todo se ha borrado");
    res.redirect("/evaluadores/" + idt);
  });

  // SetCorreo false Post
  router.post("/:idt/correo", async (req, res) => {
    const idt = req.params.idt;
    const data = await Evaluadore.updateMany({ idt: idt }, { semando: false });
    req.flash("succes", "Se pueden volver a mandar correos");
    res.redirect("/evaluadores/" + idt + "/list");
  });
};
