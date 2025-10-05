const { body } = require('express-validator')
const auth = require('../middleware/authMiddleware')
const handleValidation = require('../middleware/validation')
const { listBooks, createBook, updateBook, deleteBook } = require('../controllers/bookController')

function ensureUpdateFields(req, res, next) {
  if (req.body.title === undefined && req.body.author === undefined) {
    res.status(422).json({ errors: [{ msg: 'At least one field is required', param: 'body' }] })
    return
  }
  next()
}

function bookRoutes(app) {
  app.get('/books', listBooks)

  app.post(
    '/books',
    auth,
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    handleValidation,
    createBook
  )

  app.put(
    '/books/:id',
    auth,
    ensureUpdateFields,
    body('title').custom(value => value === undefined || String(value).trim().length > 0).withMessage('Title cannot be empty'),
    body('author').custom(value => value === undefined || String(value).trim().length > 0).withMessage('Author cannot be empty'),
    handleValidation,
    updateBook
  )

  app.delete('/books/:id', auth, deleteBook)
}

module.exports = bookRoutes
