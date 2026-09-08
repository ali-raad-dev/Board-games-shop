const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../data/mockData');

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function register(request, response) {
  const { name, email, password } = request.body;
  if (!name || !email || !password || password.length < 8) {
    return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Name, email, and a password of at least 8 characters are required.' } });
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (users.some((user) => user.email === normalizedEmail)) {
    return response.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'An account already exists for this email.' } });
  }
  const user = { id: users.length + 1, name: name.trim(), email: normalizedEmail, passwordHash: bcrypt.hashSync(password, 12), role: 'customer' };
  users.push(user);
  response.status(201).json({ user: publicUser(user), token: createToken(user) });
}

function login(request, response) {
  const { email, password } = request.body;
  const user = users.find((candidate) => candidate.email === email?.trim().toLowerCase());
  if (!user || !bcrypt.compareSync(password || '', user.passwordHash)) {
    return response.status(401).json({ error: { code: 'INVALID_LOGIN', message: 'Email or password is incorrect.' } });
  }
  response.json({ user: publicUser(user), token: createToken(user) });
}

module.exports = { register, login, publicUser };