const Book = require('../models/book')

async function listBooks(req, res) {
  const page = Math.max(1, parseInt(req.query.page || '1', 10))
  const limit = Math.max(1, parseInt(req.query.limit || '10', 10))
  const offset = (page - 1) * limit
  const total = await Book.count()
  const books = await Book.findAll({ limit, offset, attributes: ['id', 'title'] })
  const payload = {
    data: books,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1
    }
  }
  res.json(payload)
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
