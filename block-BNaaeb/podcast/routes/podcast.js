var express = require("express");
var router = express.Router();
const { NotExtended } = require("http-errors");
var auth = require("../middleware/auth");
var Podcast = require("../model/Podcast");

var multer = require("multer");
var path = require("path");

var uploadPath = path.join(__dirname, "../", "public/mp4");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });

/* GET new form */
router.get("/new", auth.isAdminLogged, function (req, res, next) {
  const error = req.flash("error")[0];
  res.render("createPodcast", { error });
});

// POST new poscast
router.post(
  "/",
  upload.fields([{ name: "audioFile" }, { name: "imageFile" }]),
  (req, res, next) => {
    req.body.audioFile = req.files.audioFile[0].filename;
    req.body.imageFile = req.files.imageFile[0].filename;
    Podcast.create(req.body, (error, podcast) => {
      if (error) {
        if (error.name === "ValidationError") {
          req.flash("error", error.message);
          return res.redirect("/podcast/new");
        }
      } else {
        res.redirect("/podcast");
      }
    });
  }
);

// GET all podcasts
router.get("/", auth.isAdminAndUserLogged, (req, res, next) => {
  var category = req.user.category || req.admin.category;
  if (category) {
    console.log(category, "fcscvsvsv");
  }
  Podcast.find({}, (error, podcasts) => {
    if (error) return next(error);
    res.render("podcasts", { podcasts });
  });
});

// GET single podcast
router.get("/:id", (req, res, next) => {
  const podcastId = req.params.id;
  Podcast.findById(podcastId, (error, podcast) => {
    res.render("podcastDetails", { podcast });
  });
});

module.exports = router;
