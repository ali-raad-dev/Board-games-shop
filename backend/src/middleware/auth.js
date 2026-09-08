const jwt = require('jsonwebtoken');

function requireAuth(request, response, next) {
  const token = request.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return response.status(401).json({ error: { code: 'AUTH_REQUIRED', message: 'A bearer token is required.' } });
  }

  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    response.status(401).json({ error: { code: 'INVALID_TOKEN', message: 'The supplied token is invalid or expired.' } });
  }
}

module.exports = { requireAuth };