var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const error = req.flash("error")[0];
  res.render("index", { error, title: "Mood Cast" });
});

module.exports = router;
