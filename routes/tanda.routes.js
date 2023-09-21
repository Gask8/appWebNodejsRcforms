module.exports = (app) => {
  const mw = require("./middelware.js");
  const Pregunta = require("../models/preguntas.model.js");
  const express = require("express");
  const router = express.Router();
  app.use("/tandas", mw.isLogIn, router);

  // ALL Get
  router.get("/", async (req, res) => {
    const data = await Pregunta.find({});
    const vsession = req.session;
    res.render("tanda/all", { data, vsession });
  });

  // ALL Evaluadores Get
  router.get("/all", async (req, res) => {
    const Evaluadore = require("../models/evaluadores.model.js");
    const data = await Evaluadore.find({});
    const vsession = req.session;
    res.render("evaluador/total", { data, vsession });
  });

  // New Get
  router.get("/new", (req, res) => {
    var vsession = req.session;
    res.render("tanda/new", { vsession });
  });

  // New Post
  router.post("/", async (req, res) => {
    const data = req.body;
    var x = data.preg.split("\r\n");
    var y = data.label.split("\r\n");
    var z = data.val.split("\r\n");
    var v = data.cat.split("\r\n");
    var w = data.cati.split("\r\n");

    await Pregunta.create(
      {
        name: data.name,
        idt: data.idt,
        mensaje: data.mensaje,
        preg: x,
        label: y,
        val: z,
        categoria: v,
        cati: w,
      },
      function (err, result) {
        if (err) {
          res.send(err);
        }
      }
    );

    req.session.itandas.push(data.idt);
    req.session.ntandas.push(data.name);

    req.flash("succes", "La tanda se ha agregado");
    res.redirect("/tandas");
  });

  // ById Get
  router.get("/edit/:tandaId", async (req, res) => {
    const data = await Pregunta.findOne({ _id: req.params.tandaId });
    const vsession = req.session;
    res.render("tanda/byId", { data, vsession });
  });

  // ById Message Get
  router.get("/edit/:tandaId/message", async (req, res) => {
    const data = await Pregunta.findOne({ _id: req.params.tandaId });
    const vsession = req.session;
    res.render("tanda/byId_message", { data, vsession });
  });

  // ById Put
  router.put("/:tandaId", async (req, res) => {
    const data = req.body;
    var x = data.preg.split("\r\n");
    var y = data.label.split("\r\n");
    var z = data.val.split("\r\n");
    var v = data.cat.split("\r\n");
    var w = data.cati.split("\r\n");

    Pregunta.findOneAndUpdate(
      { _id: req.params.tandaId },
      {
        name: data.name,
        idt: data.idt,
        mensaje: data.mensaje,
        preg: x,
        label: y,
        categoria: v,
        cati: w,
      },
      function (err, result) {
        if (err) {
          res.send(err);
        }
      }
    );
    // Pregunta.findOneAndUpdate({},{"preg": x, "val": z, "label": y, "categoria": v, "cati": w}, function(err, result){

    req.flash("succes", "Las tanda se han actualizado");
    res.redirect("/tandas");
  });

  // ById Message Put
  router.put("/message/:tandaId", async (req, res) => {
    const data = req.body;
    Pregunta.findOneAndUpdate(
      { _id: req.params.tandaId },
      { message: data.editordata, messageS: data.name },
      function (err, result) {
        if (err) {
          res.send(err);
        }
      }
    );
    req.flash("succes", "El mensaje de ha guardado");
    res.redirect("/tandas/edit/" + req.params.tandaId + "/message");
  });

  // ById Menu Get
  router.get("/:tandaId", async (req, res) => {
    const idt = req.params.tandaId;
    const data = await Pregunta.findOne({ idt: req.params.tandaId });
    const vsession = req.session;
    res.render("tanda/menu", { idt, data, vsession });
  });

  // ById Delete
  router.delete("/:tandaId", async (req, res) => {
    const Evaluado = require("../models/evaluado.model.js");
    const Evaluadore = require("../models/evaluadores.model.js");

    await Evaluadore.deleteMany({ idt: req.params.tandaId });
    await Evaluado.deleteMany({ idt: req.params.tandaId });
    await Pregunta.deleteMany({ idt: req.params.tandaId });

    const qyd = await Pregunta.find({});
    req.session.itandas = [];
    req.session.ntandas = [];
    for (let e of qyd) {
      req.session.itandas.push(e.idt);
      req.session.ntandas.push(e.name);
    }

    req.flash("del", "La Tanda completa se ha borrado");
    res.redirect("/tandas");
  });
};
