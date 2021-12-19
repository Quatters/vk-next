const express = require('express');
const router = express.Router();
const authenticateToken = require('../auth/authenticate-token');

router.get('/', authenticateToken, (req, res) => {
  try {
    return res.clearCookie('token').sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
