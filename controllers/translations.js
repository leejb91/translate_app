var Post = require("../models/post");
var User = require("../models/user");

module.exports = {
  index:   index,
  create:  create,
  destroy: destroy
};

function index(req, res) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      res.send(err);
    } else {
      res.json(post);
    }
  });
}

function create(req, res, next) {
  console.log("creating translation in backend", req.body);
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      res.send(err);
    } else {
      var newTranslate = {
        author:    req.body.author,
        body:      req.body.body
      };
      post.translations.push(newTranslate);
      post.save(function(err, success) {
        res.send(post);
      });
    }
  })
}

function destroy(req, res, next) {
  console.log("deleting translation backend");
  Post.findById(req.body.postId, function(err, post) {
    if (err) {
      res.send(err);
    } else {
      console.log(post);
      post.translations.id(req.params.id).remove();
      post.save(function(err, post) {
        if (err) {
          res.send(err);
        }
        res.send(post);
      });
    }
  })
}
