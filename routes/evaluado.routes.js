module.exports = (app) => {
  const mw = require("./middelware.js");
  const Evaluado = require("../models/evaluado.model.js");
  const express = require("express");
  const router = express.Router();
  app.use("/evaluados", mw.isLogIn, router);

  // ALL Get
  router.get("/:idt", async (req, res) => {
    const idt = req.params.idt;
    const evaluados = await Evaluado.find({ idt: idt });
    const vsession = req.session;
    res.render("evaluado/all", { idt, evaluados, vsession });
  });

  //New Get
  router.get("/:idt/new", (req, res) => {
    const idt = req.params.idt;
    var vsession = req.session;
    res.render("evaluado/new", { idt, vsession });
  });

  // New Post
  router.post("/:idt", async (req, res) => {
    const data = req.body;
    const idt = req.params.idt;
    var evaluado;
    var x = data.evaluadores.split("\r\n");
    for (let i = 0; i < x.length; i++) {
      let y = x[i].split(",");
      let obj = { nombre: y[0], posicion: y[2], categoria: y[1], correo: y[3] };
      if (i == 0) {
        evaluado = new Evaluado({
          nombre: y[0],
          posicion: y[2],
          categoria: y[1],
          correo: y[3],
          idt: idt,
        });
      }
      evaluado.evaluadores.push(obj);
    }
    evaluado.save();

    req.flash("succes", "El evaluado se ha agregado");
    res.redirect("/evaluados/" + idt);
  });

  // ById Get
  router.get("/:idt/:evaluadoId", async (req, res) => {
    const idt = req.params.idt;
    const data = await Evaluado.findOne({ _id: req.params.evaluadoId });
    const vsession = req.session;
    res.render("evaluado/byId", { idt, data, vsession });
  });

  // ById Delete
  router.delete("/:idt/:evaluadoId", async (req, res) => {
    const idt = req.params.idt;
    await Evaluado.findByIdAndDelete(req.params.evaluadoId);
    req.flash("del", "El Evaluado se ha borrado");
    res.redirect("/evaluados/" + idt);
  });

  // Calcular ById Get
  router.get("/:idt/calcular/:evaluadoId", async (req, res) => {
    const Pregunta = require("../models/preguntas.model.js");
    const idt = req.params.idt;
    const data = await Evaluado.findOne({ _id: req.params.evaluadoId });
    const quest = await Pregunta.findOne({ idt: idt });
    const vsession = req.session;
    res.render("evaluado/resultado", { idt, data, quest, vsession });
  });

  // Calcular ById Post
  router.post("/:idt/calcular/:evaluadoId", async (req, res) => {
    const Pregunta = require("../models/preguntas.model.js");
    const resp = req.body;
    const idt = req.params.idt;
    const data = await Evaluado.findOne({ _id: req.params.evaluadoId });
    const quest = await Pregunta.findOne({ idt: idt });
    const vsession = req.session;
    res.render("evaluado/reporte", { idt, data, quest, vsession, resp });
  });
};
