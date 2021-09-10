var express = require("express");
const Article = require("../models/Article");
var router = express.Router();

var Comment = require("../models/Comment");

router.get("/:id/edit", (req, res, next) => {
  var id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    res.render("updateComment", { comment });
  });
});

router.post("/:id", (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, updateComment) => {
    if (err) return next(err);
    res.redirect("/articles/" + updateComment.bookId);
  });
});

router.get("/:id/delete", (req, res, next) => {
  var commentId = req.params.id;
  Comment.findByIdAndDelete(commentId, (err, comment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      comment.bookId,
      { $pull: { comments: comment.id } },
      (err, article) => {
        res.redirect("/articles/" + comment.bookId);
      }
    );
  });
});
module.exports = router;
