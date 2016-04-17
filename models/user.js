var mongoose = require('mongoose'),
    debug    = require('debug')('app:models');

var userSchema = new mongoose.Schema({
  email:     { type: String, required: true, unique: true },
  name:      { type: String, required: true },
  languages: [{ type: String }],
  posts:     [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

// Add bcrypt hashing to model
userSchema.plugin(require('mongoose-bcrypt'));

userSchema.options.toJSON = {
  transform: function(document, returnedObject, options) {
    delete returnedObject.password;
    return returnedObject;
  }
};

var User = mongoose.model('User', userSchema);

module.exports = User;
