const Book = require('../models/book')

async function listBooks(req, res) {
  const page = parseInt(req.query.page || '1', 10)
  const limit = parseInt(req.query.limit || '10', 10)
  const safePage = Number.isFinite(page) && page > 0 ? page : 1
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10
  const offset = (safePage - 1) * safeLimit
  const total = await Book.count()
  const data = await Book.findAll({ limit: safeLimit, offset, attributes: ['id', 'title'] })
  res.json({
    data,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.max(1, Math.ceil(total / safeLimit))
    }
  })
}

async function createBook(req, res) {
  const { title, author } = req.body
  const book = await Book.create({ title, author, userId: req.user.id })
  res.status(201).json(book)
}

async function updateBook(req, res) {
  const { id } = req.params
  const book = await Book.findByPk(id)
  if (!book) {
    res.status(404).json({ message: 'Book not found' })
    return
  }
  if (book.userId !== req.user.id) {
    res.status(403).json({ message: 'Forbidden' })
    return
  }
  const updates = {}
  if (req.body.title !== undefined) updates.title = req.body.title
  if (req.body.author !== undefined) updates.author = req.body.author
  await Book.update(updates, { where: { id: book.id } })
  const updated = await Book.findByPk(book.id)
  res.json(updated)
}

async function deleteBook(req, res) {
  const { id } = req.params
  const book = await Book.findByPk(id)
  if (!book) {
    res.status(404).json({ message: 'Book not found' })
    return
  }
  if (book.userId !== req.user.id) {
    res.status(403).json({ message: 'Forbidden' })
    return
  }
  await Book.destroy({ where: { id: book.id } })
  res.status(204).send('')
}

module.exports = { listBooks, createBook, updateBook, deleteBook }
