var User = require("../models/user");

module.exports = {
  create: create,
  update: update,
  me:     me
};

function create(req, res, next) {
  if (!req.body.password) {
    return res.status(422).send('Missing required fields');
  }
  User
    .create(req.body)
    .then(function(user) {
      res.json({
        success: true,
        message: 'Successfully created user.',
        data: {
          email: user.email,
          id:    user._id
        }
      });
    }).catch(function(err) {
      if (err.message.match(/E11000/)) {
        err.status = 409;
      } else {
        err.status = 422;
      }
      next(err);
    });
};

function me(req, res, next) {
  User
    .findOne({email: req.decoded.email}).exec()
    .then(function(user) {
      res.json({
        success: true,
        message: 'Successfully retrieved user data.',
        data:    user
      });
    })
    .catch(function(err) {
      next(err);
    });
};

function update(req, res, next) {
  User
    .findById(req.decoded._id).exec()
    .then(function(user) {
      if (req.body.email)    user.email    = req.body.email;
      if (req.body.name)     user.name     = req.body.name;
      if (req.body.password) user.password = req.body.password;

      return user.save();
    })
    .then(function(user) {
      res.json({
        success: true,
        message: 'Successfully updated user data.'
      });
    })
    .catch(function(err) {
      next(err);
    });
}
