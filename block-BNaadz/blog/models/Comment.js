var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  content: { type: String, required: true },
  bookId: { type: Schema.Types.ObjectId, ref: "Article", required: true },
});

module.exports = mongoose.model("Comment", commentSchema);
