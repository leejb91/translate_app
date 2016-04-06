var Post = require("../models/post");
var User = require("../models/user");

module.exports = {
  index:  index,
  create: create,
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
      res.send(err)
    } else {
      var newTranslate = {
        author:    req.body.author,
        body:      req.body.body
      };
      console.log("post stuff before the push", post)
      post.translations.push(newTranslate);
      console.log("post stuff", post, newTranslate)
      post.save(function(err, success) {
        console.log("after saving", post);
        console.log("any errors?", err)
        res.send(post);
      });

    }
  })
  // .then(function(post) {
  //   console.log("after saving", post)
  //   res.json(post);
  // })
  // .catch(function(err) { next(err); });
}

function destroy() {

}
