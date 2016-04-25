var Post = require("../models/post");
var User = require("../models/user");

module.exports = {
  index:   index,
  show:    show,
  create:  create,
  destroy: destroy
};

function index(req, res) {
  Post.find({}).populate("author").exec()
    .then(function(posts) {
      res.json(posts);
    }, function(err) {
      if (err) res.json({ message: "No posts" });
    });
}

function show(req, res) {
  Post.findById(req.params.id)
      .populate("author").exec()
        .then(function(post) {
          console.log("show", post);
          res.json(post);
        }, function(err) {
          if (err) res.json({ message: "No post" });
        })
}

// function show(req, res) {
//   Post.findById(req.params.id, function(err, post) {
//     console.log("show", req.params.id);
//     if (err) res.json({ message: "Post not found because " + err });
//     res.json(post)
//   })
// }

function create(req, res, next) {
  Post
    .create(req.body)
    .then(function(post) {
      res.json({
        data: {
          author:     post.author,
          body:       post.body,
          language:   post.language,
          skillLevel: post.skillLevel
        }
      })
    }).catch(function(err) { next(err); });
}

function destroy(req, res, next) {
  var id = req.params.id;

  Post.remove({ _id: id }, function(err) {
    if (err) { res.send(err); };
  })
  .then(function(post) {
    res.json({ success: "success" })
  })
}
