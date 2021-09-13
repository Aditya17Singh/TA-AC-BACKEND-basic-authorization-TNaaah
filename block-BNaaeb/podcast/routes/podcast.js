var express = require("express");
var router = express.Router();
const { NotExtended } = require("http-errors");
var auth = require("../middleware/auth");
var Podcast = require("../model/Podcast");
var multer = require("multer");
var path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//List Podcast
router.get("/", (req, res, next) => {
  if (req.user.isAdmin) {
    Podcast.find({}, (err, podcast) => {
      if (err) return next(err);
      res.render("podcast", { podcast });
    });
  } else {
    Podcast.find({ isVerified: true }, (err, podcast) => {
      if (err) return next(err);
      res.render("podcast", { podcast });
    });
  }
});

//create Podcast form
router.get("/new", auth.loggedInUser, (req, res) => {
  res.render("addPodcast");
});

router.post(
  "/",
  auth.loggedInUser,
  upload.fields([{ name: "imageFile" }, { name: "audioFile" }]),
  (req, res, next) => {
    req.body.imageFile = req.files.imageFile[0].filename;
    req.body.audioFile = req.files.audioFile[0].filename;
    if (req.user.isAdmin) {
      req.body.isVerified = true;
    }
    Podcast.create(req.body, (err, createdPodcast) => {
      if (err) return next(err);
      res.redirect("/podcast");
    });
  }
);
//pending
router.get("/pending", auth.loggedInUser, (req, res) => {
  Podcast.find({ isVerified: false }, (err, podcast) => {
    if (err) return next();
    res.render("pending", { podcast });
  });
});
//Fetch single Podacst
router.get("/:id", (req, res, next) => {
  var id = req.params.id;
  Podcast.findById(id, (err, podcast) => {
    Podcast.findById(id);
    if (err) return next(err);
    res.render("podcastDetails", { podcast });
  });
});

module.exports = router;
