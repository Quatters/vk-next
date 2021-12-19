function getToken(req) {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  return token ?? req.cookies.token;
}

module.exports = getToken;
