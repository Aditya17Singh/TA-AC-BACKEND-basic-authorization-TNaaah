var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var podcastSchema = new Schema({
  title: { type: String },
  artist: { type: String },
  releaseDate: { type: Date },
  audioFile: { type: String },
  imageFile: { type: String },
});

module.exports = mongoose.model("Podcast", podcastSchema);
