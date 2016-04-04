var mongoose = require('mongoose'),
    debug    = require('debug')('app:models');

var translationSchema = new mongoose.Schema({
  author:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  body:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  favorited: { type: Boolean, default: false }
});

var postSchema = new mongoose.Schema({
  author:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  body:         { type: String, required: true },
  createdAt:    { type: Date, default: Date.now },
  language:     String,
  answered:     { type: Boolean, default: false },
  skillLevel:   { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
  translations: [translationSchema],
});

var Post = mongoose.model("Post", postSchema);

module.exports = Post;
