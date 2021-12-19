const express = require('express');
const router = express.Router();
const User = require('../data/models/user.js');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  try {
    login = req.body.login;
    const normalizedLogin = login.toLowerCase();
    const isLoginUnique = (await User.findOne({ normalizedLogin })) === null;
    if (!isLoginUnique) {
      return res.status(400).send('This login is already taken.');
    }

    password = req.body.password;
    if (password.length < 4) {
      return res.status(400).send('Password is too short.');
    }
    hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      login,
      normalizedLogin,
      password: hashedPassword,
      name: req.body.name,
      surname: req.body.surname,
    });

    await user.save();

    return res.status(201).send('Registered');
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
