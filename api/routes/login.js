const express = require('express');
const router = express.Router();
const User = require('../data/models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  try {
    const login = req.body.login;
    const user = await User.findOne({ login });
    if (!user) {
      return res.status(404).send('Login or password is incorrect.');
    }

    const password = req.body.password;
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordsMatch) {
      return res.status(404).send('Login or password is incorrect.');
    }

    const token = jwt.sign({ login }, process.env.SECRET);
    return res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'lax',
      })
      .status(200)
      .send();
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
