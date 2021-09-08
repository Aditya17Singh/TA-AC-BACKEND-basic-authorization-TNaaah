var express = require("express");
const { NotExtended } = require("http-errors");
var router = express.Router();
var auth = require("../middlewares/auth");

var Article = require("../models/Article");
var Comment = require("../models/Comment");

//List Articles
router.get("/", (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    console.log(req.session);
    res.render("articles", { articles });
  });
});

//create article form
router.get("/new", auth.loggedInUser, (req, res) => {
  res.render("addArticle");
});

//fetch single article
router.get("/:id", (req, res, next) => {
  var id = req.params.id;
  Article.findById(id, (err, article) => {
    Article.findById(id)
      .populate("comments")
      .exec((err, article) => {
        if (err) return next(err);
        res.render("articleDetails", { article });
      });
  });
});

router.use(auth.loggedInUser);

//create Article
router.post("/", (req, res, next) => {
  req.body.tags = req.body.tags.trim().split(" ");
  Article.create(req.body, (err, createdArticle) => {
    if (err) return next(err);
    res.redirect("/articles");
  });
});

//Edit
router.get("/:id/edit", (req, res) => {
  var id = req.params.id;
  Article.findById(id, (err, article) => {
    article.tags = article.tags.join(" ");
    if (err) return next(err);
    res.render("editArticleForm", { article });
  });
});
//Update article
router.post("/:id", (req, res, next) => {
  var id = req.params.id;
  req.body.tags = req.body.tags.split(" ");
  Article.findByIdAndUpdate(id, req.body, (err, updateData) => {
    if (err) return next(err);
    res.redirect("/articles/" + id);
  });
});

//delete
router.get("/:id/delete", (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndDelete(id, (err, article) => {
    if (err) return next(err);
    Comment.deleteMany({ bookId: bookId }, (err, info) => {
      res.redirect("/articles");
    });
  });
});

//Likes
router.get("/:id/likes", (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, article) => {
    if (err) return next(err);
    res.redirect("/articles/" + id);
  });
});

//Dislike
router.get("/:id/Dislike", (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { Dislike: 1 } }, (err, article) => {
    if (err) return next(err);
    res.redirect("/articles/" + id);
  });
});

//Add Comment
router.post("/:id/comments", (req, res, next) => {
  var id = req.params.id;
  req.body.bookId = id;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    //update book with comment id into comment sections
    Article.findByIdAndUpdate(
      id,
      { $push: { comments: comment.id } },
      (err, updatebook) => {
        if (err) return next(err);
        res.redirect("/articles/" + id);
      }
    );
  });
});

module.exports = router;
