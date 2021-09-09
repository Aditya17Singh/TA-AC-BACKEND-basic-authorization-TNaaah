var express = require("express");
var router = express.Router();

var User = require("../models/User");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("users");
});
router.use("/dashboard", (req, res, next) => {
  if (req.session && req.session.userId) {
    let userId = req.session.userId;
    User.findById(userId, (err, user) => {
      if (err) return next(err);
      res.render("dashboard", { user });
    });
  } else {
    res.redirect("/users/login");
  }
});

router.get("/register", (req, res, next) => {
  res.render("register", { error: req.flash("error")[0] });
});
router.post("/register", (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) {
      if (err.name === "MongoError") {
        req.flash("error", "This email is taken");
        return res.redirect("/users/register");
      }
      return res.json({ err });
    }
    res.redirect("/users/login");
  });
});

router.get("/login", (req, res, next) => {
  var error = req.flash("error")[0];
  res.render("login", { error });
});

router.post("/login", (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Email/Password required");
    return res.redirect("/users/login");
  }
  User.findOne({ email }, (err, user) => {
    console.log(req.body, user);
    if (err) return next(err);
    //no user
    if (!user) {
      return res.redirect("/users/login");
    }
    //compare password
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        return res.redirect("/users/login");
      }
      //persisit logged in user info
      req.session.userId = user.id;
      res.redirect("/users/dashboard");
    });
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/users/login");
});

module.exports = router;
