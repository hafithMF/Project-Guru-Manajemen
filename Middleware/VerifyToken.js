const jwt = require('jsonwebtoken');

async function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  jwt.verify(token, 'teacherSecretKey', function (err, decoded) {
    if (err) {
      return res.status(401).json({
        message: "Invalid Token, Unauthorized"
      })
    }
    req.auth = decoded;
    return next();
  })
}

module.exports = verifyToken;
