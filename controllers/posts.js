var Post = require("../models/post");

module.exports = {
  index:   index,
  create:  create,
  destroy: destroy
};

function index(req, res) {
  Post.find(function(err, posts) {
    if (err) res.json({ message: "No posts" });

    res.json({ posts: posts })
  })
}

function create(req, res, next) {
  Post
    .create(req.body)
    .then(function(post) {
      console.log(post);
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

function destroy() {
  console.log("deleting post backend");
  console.log(req.body);

  Post
    .delete(req.body)
    .then(function() {

    })
}
