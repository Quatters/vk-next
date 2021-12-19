const jwt = require('jsonwebtoken');
const getToken = require('./get-token');

function authenticateToken(req, res, next) {
  const token = getToken(req);

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    if (next) next();
  });
}

module.exports = authenticateToken;
