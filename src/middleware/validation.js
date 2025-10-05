const { validationResult } = require('express-validator')

function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }
  next()
}

module.exports = handleValidation
