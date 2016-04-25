var Post = require("../models/post");
var User = require("../models/user");

module.exports = {
  index:   index,
  create:  create,
  update:  update,
  destroy: destroy
};

function index(req, res) {
  Post.find({}).populate("author").exec()
    .then(function(posts) {
      // console.log(posts);
      res.json(posts);
    }, function(err) {
      if (err) res.json({ message: "No posts" });
    });
}

function create(req, res, next) {
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
