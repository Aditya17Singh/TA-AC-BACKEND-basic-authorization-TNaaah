var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var podcastSchema = new Schema(
  {
    title: { type: String },
    artist: { type: String },
    imageFile: { type: String },
    audioFile: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Podcast", podcastSchema);
