const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const accessSecret = process.env.JWT_SECRET || 'access-secret'
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret'
const refreshTokens = new Map()

function buildUserPayload(user) {
  return { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, username: user.username }
}

function issueTokens(user) {
  const payload = { id: user.id, username: user.username }
  const accessToken = jwt.sign(payload, accessSecret, { expiresIn: '15m' })
  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' })
  refreshTokens.set(refreshToken, payload)
  return { accessToken, refreshToken }
}

async function register(req, res) {
  const { firstName, lastName, email, username, password } = req.body
  const existingEmail = await User.findOne({ where: { email } })
  if (existingEmail) {
    res.status(409).json({ message: 'Email already in use' })
    return
  }
  const existingUsername = await User.findOne({ where: { username } })
  if (existingUsername) {
    res.status(409).json({ message: 'Username already in use' })
    return
  }
  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ firstName, lastName, email, username, password: hashed })
  const safeUser = buildUserPayload(user)
  const tokens = issueTokens(safeUser)
  res.status(201).json({ user: safeUser, tokens })
}

async function login(req, res) {
  const { email, password } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }
  const safeUser = buildUserPayload(user)
  const tokens = issueTokens(safeUser)
  res.json({ user: safeUser, tokens })
}

async function refreshToken(req, res) {
  const { refreshToken } = req.body
  if (!refreshToken) {
    res.status(400).json({ message: 'Refresh token required' })
    return
  }
  if (!refreshTokens.has(refreshToken)) {
    res.status(401).json({ message: 'Invalid refresh token' })
    return
  }
  try {
    const payload = jwt.verify(refreshToken, refreshSecret)
    refreshTokens.delete(refreshToken)
    const userTokens = issueTokens({ id: payload.id, username: payload.username })
    res.json(userTokens)
  } catch (error) {
    refreshTokens.delete(refreshToken)
    res.status(401).json({ message: 'Invalid refresh token' })
  }
}

module.exports = { register, login, refreshToken }
