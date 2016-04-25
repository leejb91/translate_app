var Post = require("../models/post");
var User = require("../models/user");

module.exports = {
  show:    show,
  create:  create,
  update:  update,
  destroy: destroy
};

function show(req, res) {
  Post.findById(req.params.id)
      .populate("author translations.author").exec()
        .then(function(post) {
          res.json(post);
        }, function(err) {
          if (err) res.json({ message: "No post" });
        })
}

function create(req, res, next) {
  Post.findById(req.params.id)
      .populate("author translations.author").exec()
      .then(function(post) {
        var newTranslate = {
          author:    req.body.author,
          body:      req.body.body
        };
        post.translations.push(newTranslate);
        post.save(function(err, success) {
          res.send(post);
        });
      })
}

function update(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      res.send(err);
    } else {
      var trans = post.translations.id(req.params.trans_id);

      if (req.body.favorited !== undefined) trans.favorited = req.body.favorited;
      if (req.body.body      !== undefined) trans.body      = req.body.body;


      post.save(function(err, post) {
        res.json({data: post, message: "translation updated!"});
      })
    }
  });
};

function destroy(req, res, next) {
  Post.findById(req.body.postId, function(err, post) {
    if (err) {
      res.send(err);
    } else {
      console.log(post);
      post.translations.id(req.params.trans_id).remove();
      post.save(function(err, post) {
        if (err) {
          res.send(err);
        }
        res.send(post);
      });
    }
  })
}
