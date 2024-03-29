var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var MongoStore = require("connect-mongo");
var session = require("express-session");
var flash = require("connect-flash");

require("dotenv").config();

var indexRouter = require("./routes/index");
var articleRouter = require("./routes/article");
var commentRouter = require("./routes/comment");
var userRouter = require("./routes/users");
var auth = require("./middlewares/auth");

//connect to the database
mongoose.connect(
  "mongodb://localhost/blog1",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log(err ? err : "Connected true");
  }
);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({ mongoUrl: "mongodb://localhost/blog1" }),
  })
);
app.use(flash());

app.use(auth.userInfo);

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use(auth.loggedInUser);
app.use("/articles", articleRouter);
app.use("/comment", commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
