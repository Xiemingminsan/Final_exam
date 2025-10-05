const { body } = require('express-validator')
const { register, login, refreshToken } = require('../controllers/authController')
const handleValidation = require('../middleware/validation')

function authRoutes(app) {
  app.post(
    '/user/register',
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email must be valid'),
    body('username').notEmpty().withMessage('Username is required').isAlphanumeric().withMessage('Username must be alphanumeric'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidation,
    register
  )

  app.post(
    '/user/login',
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email must be valid'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidation,
    login
  )

  app.post(
    '/user/refreshToken',
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
    handleValidation,
    refreshToken
  )
}

module.exports = authRoutes
