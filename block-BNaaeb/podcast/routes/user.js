var express = require("express");
var router = express.Router();

var User = require("../model/User");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("user");
});
router.use("/userDashboard", (req, res, next) => {
  if (req.session && req.session.userId) {
    let userId = req.session.userId;
    User.findById(userId, (err, user) => {
      if (err) return next(err);
      res.render("userDashboard", { user });
    });
  } else {
    res.redirect("/user/login");
  }
});

router.use("/adminDashboard", (req, res, next) => {
  if (req.session && req.session.userId) {
    let userId = req.session.userId;
    User.findById(userId, (err, user) => {
      if (err) return next(err);
      res.render("adminDashboard", { user });
    });
  } else {
    res.redirect("/user/login");
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
        return res.redirect("/user/register");
      }
      return res.json({ err });
    }
    res.redirect("/user/login");
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
    return res.redirect("/user/login");
  }
  User.findOne({ email }, (err, user) => {
    console.log(req.body, user);
    if (err) return next(err);
    //no user
    if (!user) {
      return res.redirect("/user/login");
    }
    //compare password
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        return res.redirect("/user/login");
      }
      //persisit logged in user info
      req.session.userId = user.id;
      if (user.isAdmin === true) {
        res.redirect("/user/adminDashboard");
      } else {
        res.redirect("/user/userDashboard");
      }
    });
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/user/login");
});

module.exports = router;
