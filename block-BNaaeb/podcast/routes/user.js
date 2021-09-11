var express = require("express");
var router = express.Router();

var User = require("../model/User");

//  registration
router.get("/register/new", (req, res, next) => {
  const error = req.flash("error");
  res.render("registration", { error });
});

router.post("/register", (req, res, next) => {
  var { name, email, password, category } = req.body;
  if (!name || !email || !password || !category) {
    req.flash("error", "Enter required fields!");
    return res.redirect("/user/register/new");
  }
  User.create(req.body, (error, user) => {
    if (error) {
      if (error.name === "MongoError") {
        req.flash("error", "Admin already exsits!");
        return res.redirect("/user/register/new");
      }
      if (error.name === "ValidationError") {
        req.flash("error", error.message);
        return res.redirect("/user/register/new");
      }
    }
    res.redirect("/");
  });
});

// login
router.post("/login", (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Enter required fields!");
    return res.redirect("/");
  }
  User.findOne({ email }, (error, user) => {
    if (error) return next(error);
    if (!user) {
      req.flash("error", "User does not exists!");
      return res.redirect("/");
    }
    console.log("Hi1");
    user.comparePassword(password, (error, result) => {
      console.log(result, "result");
      if (error) return next(error);
      console.log("Hi3");
      if (!result) {
        req.flash("error", "Password is wrong!");
        return res.redirect("/");
      } else {
        if (user.isAdmin) {
          req.session.adminId = user.id;
          res.render("adminDashboard");
        } else {
          req.session.userId = user.id;
          res.redirect("/podcast");
        }
      }
    });
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/");
});

module.exports = router;
