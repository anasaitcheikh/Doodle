const jwt = require('jsonwebtoken');

const OPEN_SECRET_KEY = 'open-secret-key';
const AUTHENTICATED_SECRET_KEY = 'authenticated-secret-key';

function verifyJWTToken(token, isOpen = false) {
  return jwt.verify(token, isOpen ? OPEN_SECRET_KEY : AUTHENTICATED_SECRET_KEY);
}

function createJWToken(data, isOpen = false) {
  const token = jwt.sign(data, isOpen ? OPEN_SECRET_KEY : AUTHENTICATED_SECRET_KEY);
  return token;
}

module.exports = {
  verifyJWTToken: verifyJWTToken,
  createJWToken: createJWToken
} 