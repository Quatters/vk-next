const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  login: String,
  normalizedLogin: { type: String, index: true, minlength: 4 },
  password: String,
  name: String,
  surname: String,
  avatarBase64: String,
  about: String,
  posts: [
    {
      name: String,
      surname: String,
      avatarBase64: String,
      body: String,
      login: String,
      added: { type: Date, default: new Date() },
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);
