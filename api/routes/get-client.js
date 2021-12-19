const express = require('express');
const router = express.Router();

router.get('/*', (req, res) => {
  return res.sendFile('index.html', { root: 'client' });
});

module.exports = router;
