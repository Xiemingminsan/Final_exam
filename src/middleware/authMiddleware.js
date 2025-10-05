const jwt = require('jsonwebtoken')

const accessSecret = process.env.JWT_SECRET || 'access-secret'

function authMiddleware(req, res, next) {
  const header = req.headers['authorization'] || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  try {
    const payload = jwt.verify(token, accessSecret)
    req.user = payload
    next()
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

module.exports = authMiddleware
